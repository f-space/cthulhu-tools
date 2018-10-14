import React from 'react';
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { Status, Skill, SkillCategory } from "models/status";
import { Section } from "./section";
import style from "./skill-section.scss";

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

interface SkillGroup {
	category: SkillCategory;
	skills: Skill[];
}

function group(skills: ReadonlyArray<Skill>): SkillGroup[] {
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

	return sort(Array.from(groups.values()));
}

function sort(groups: SkillGroup[]): SkillGroup[] {
	groups.sort((x, y) => SkillCategory.compare(x.category, y.category));
	groups.forEach(group => group.skills.sort((x, y) => String.prototype.localeCompare.call(x.name, y.name)));
	return groups;
}

export interface SkillSectionProps {
	status: Status;
}

export function SkillSection({ status }: SkillSectionProps) {
	const hash = status.current;
	const skills = status.context.profile.skills;
	const groups = group(skills);

	return <Section heading="技能">
		<div className={style['skills']}>
			{
				groups.map(group =>
					<React.Fragment key={group.category}>
						<h5 className={style['category']}>{CATEGORY_NAME[group.category]}</h5>
						<dl className={style['group']}>
							{
								group.skills.map(skill =>
									<div key={skill.uuid} className={style['skill']}>
										<dt className={style['name']}>{skill.name}</dt>
										<dd className={style['value']}>
											<EvaluationText target={`@skill:${skill.id}`} hash={hash} />
										</dd>
									</div>
								)
							}
						</dl>
					</React.Fragment>
				)
			}
		</div>
	</Section>
}