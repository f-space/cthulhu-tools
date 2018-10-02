import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Status, SkillCategory, Skill } from "models/status";
import { EvaluationProvider } from "components/shared/decorators/evaluation";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { Carousel, CarouselView, CarouselContext } from "components/shared/layouts/carousel";
import { Page, Navigation } from "components/shared/templates/page";
import { Dots } from "./dots";
import style from "./template.scss";

export interface StatusTemplateProps {
	statusList: Status[];
}

interface SkillGroup {
	category: SkillCategory;
	skills: Skill[];
}

const NAVS: Navigation[] = [
	{
		to: "/status/character-management",
		icon: "list",
	}
];

const CATEGORY_NAME = {
	[SkillCategory.Locomotion]: "移動",
	[SkillCategory.Investigation]: "調査",
	[SkillCategory.Communication]: "対話",
	[SkillCategory.Knowledge]: "知識",
	[SkillCategory.Scholarship]: "学問",
	[SkillCategory.Language]: "言語",
	[SkillCategory.Combat]: "戦闘",
	[SkillCategory.Special]: "特殊",
	[SkillCategory.Other]: "その他",
};

export class StatusTemplate extends React.Component<StatusTemplateProps> {
	public render() {
		const { statusList } = this.props;

		return <Page id="status" heading="ステータス" navs={NAVS}>
			<Carousel models={statusList} wrap={true}>
				{
					context => <div className={style['container']}>
						<CarouselView className={style['list']} context={context} render={status => this.renderStatus(status)} />
						{context.models.length !== 0 && this.renderPager(context)}
					</div>
				}
			</Carousel>
		</Page>
	}

	private renderStatus(status: Status) {
		const chain = status.chain;
		const hash = status.current;

		return <EvaluationProvider value={chain}>
			<section className={style['status']}>
				<h3 className={style['name']}><EvaluationText expression="@attr:name" hash={hash} /></h3>
				{this.renderAttributes(status)}
				{this.renderSkills(status)}
			</section>
		</EvaluationProvider>
	}

	private renderAttributes(status: Status) {
		const hash = status.current;
		const attributes = status.context.profile.attributes;

		return <section className={style['section']}>
			<dl className={style['attributes']}>
				{
					attributes.map(attribute =>
						<div key={attribute.uuid} className={classNames(style['attribute'], style[attribute.type], style[`id-${attribute.id}`])}>
							<dt className={style['attr-name']}>{attribute.name}</dt>
							<dd className={style['attr-value']}><EvaluationText expression={`@attr:${attribute.id}`} hash={hash} /></dd>
						</div>
					)
				}
			</dl>
		</section>
	}

	private renderSkills(status: Status) {
		const hash = status.current;
		const skills = status.context.profile.skills;
		const groups = this.groupSkills(skills);

		return <section className={style['section']}>
			<h4 className={style['heading']}>技能</h4>
			<dl className={style['skills']}>
				{
					groups.map(group =>
						<React.Fragment key={group.category}>
							<h5 className={style['category-name']}>{CATEGORY_NAME[group.category]}</h5>
							<div className={style['category']}>
								{
									group.skills.map(skill =>
										<div key={skill.uuid} className={style['skill']}>
											<dt className={style['skill-name']}>{skill.name}</dt>
											<dd className={style['skill-value']}><EvaluationText expression={`@skill:${skill.id}`} hash={hash} /></dd>
										</div>
									)
								}
							</div>
						</React.Fragment>
					)
				}
			</dl>
		</section>
	}

	private renderPager(context: CarouselContext<unknown>) {
		return <div className={style['pager']}>
			<button className={classNames(style['shift'], style['prev'])} type="button" onClick={() => context.shift(-1)}>
				<FontAwesomeIcon icon="chevron-circle-left" size="2x" />
			</button>
			<div className={style['indicator']}>
				<Dots length={context.models.length} index={context.index} />
			</div>
			<button className={classNames(style['shift'], style['next'])} type="button" onClick={() => context.shift(1)}>
				<FontAwesomeIcon icon="chevron-circle-right" size="2x" />
			</button>
		</div>
	}

	private groupSkills(skills: ReadonlyArray<Skill>): SkillGroup[] {
		const groups = new Map<SkillCategory, SkillGroup>();
		for (const skill of skills) {
			const group = groups.get(skill.category);
			if (group) {
				group.skills.push(skill);
			} else {
				groups.set(skill.category, {
					category: skill.category,
					skills: [skill],
				});
			}
		}

		return this.sortSkills(Array.from(groups.values()));
	}

	private sortSkills(groups: SkillGroup[]): SkillGroup[] {
		groups.sort((x, y) => SkillCategory.compare(x.category, y.category));
		groups.forEach(group => group.skills.sort((x, y) => String.prototype.localeCompare.call(x.name, y.name)));
		return groups;
	}
}