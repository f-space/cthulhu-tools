import React from 'react';
import classNames from 'classnames';
import { Status, Skill } from "models/status";
import { SkillGroup } from "components/shared/decorators/skill-group";
import { SkillCategory } from "components/shared/primitives/skill-category";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { Section } from "./section";
import style from "./skill-section.scss";

export interface SkillSectionProps {
	status: Status;
	edit: boolean;
	onEdit(target: Skill): void;
}

export function SkillSection({ status, edit, onEdit }: SkillSectionProps) {
	const hash = status.current;
	const skills = status.context.profile.skills;

	return <Section heading="技能">
		<div className={style['skills']}>
			<SkillGroup skills={skills}>
				{
					({ category, skills }) => <React.Fragment key={category}>
						<h5 className={style['category']}>
							<SkillCategory category={category} />
						</h5>
						<dl className={style['group']}>
							{
								skills.map(skill => {
									const classList = classNames(
										style['skill'],
										{ [style['edit']]: edit },
									);

									return <div key={skill.uuid} className={classList} onClick={() => edit && onEdit(skill)}>
										<dt className={style['name']}>{skill.name}</dt>
										<dd className={style['value']}>
											<span>
												<EvaluationText target={`@skill:${skill.id}`} hash={hash} />
											</span>
											<span className={style['points']}>
												<span>(</span>
												<EvaluationText target={`@skill:${skill.id}:points`} hash={hash} />
												<span>)</span>
											</span>
										</dd>
									</div>
								})
							}
						</dl>
					</React.Fragment>
				}
			</SkillGroup>
		</div>
	</Section>
}