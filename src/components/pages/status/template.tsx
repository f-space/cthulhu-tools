import React from 'react';
import { DataProvider, Status } from "models/status";
import { Carousel, CarouselView } from "components/shared/layouts/carousel";
import { Page, Navigation } from "components/shared/templates/page";
import style from "./template.scss";

export interface StatusTemplateProps {
	provider: DataProvider;
	statusList: Status[];
}

const NAVS: Navigation[] = [
	{
		to: "/status/character-management",
		icon: "list",
	}
];

export class StatusTemplate extends React.Component<StatusTemplateProps> {
	public render() {
		const { statusList } = this.props;

		return <Page id="status" heading="ステータス" navs={NAVS}>
			<Carousel models={statusList} wrap={true}>
				{
					context => <CarouselView className={style['characters']} context={context} render={status =>
						<section className={style['character']}>
							{this.renderAttributes(status)}
							{this.renderSkills(status)}
							{this.renderItems(status)}
						</section>
					} />
				}
			</Carousel>
		</Page>
	}

	private renderAttributes(status: Status) {
		const attributes = status.context.profile.attributes;

		return <section>
			<header><h3>人物/能力</h3></header>
			<dl className={style['attributes']}>
				{
					attributes.map(attribute =>
						<div key={attribute.uuid} className={style['attribute']}>
							<dt className={style['name']}>{attribute.name}</dt>
							<dd className={style['value']}>{status.get(`@attr:${attribute.id}`)}</dd>
						</div>
					)
				}
			</dl>
		</section>
	}

	private renderSkills(status: Status) {
		const skills = status.context.profile.skills;

		return <section>
			<header><h3>技能</h3></header>
			<dl className={style['skills']}>
				{
					skills.map(skill =>
						<div key={skill.uuid} className={style['skill']}>
							<dt className={style['name']}>{skill.name}</dt>
							<dd className={style['value']}>{status.get(`@skill:${skill.id}`)}</dd>
						</div>
					)
				}
			</dl>
		</section>
	}

	private renderItems(status: Status) {
		const { provider } = this.props;
		const items = provider.item.get(Object.keys(status.context.character.params.item));

		return <section>
			<header><h3>所持品</h3></header>
			<dl className={style['items']}>
				{
					items.map(item =>
						<div className={style['item']}>
							<dt className={style['name']}>{item.name}</dt>
							<dd className={style['description']}>{item.description}</dd>
						</div>
					)
				}
			</dl>
		</section>
	}
}