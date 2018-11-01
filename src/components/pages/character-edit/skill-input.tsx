import React from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { Skill, SkillCategory } from 'models/status';
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { NumberInput } from "components/shared/widgets/input";
import { Select } from "components/shared/widgets/select";
import style from "./skill-input.scss";

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

export interface SkillInputValue {
	id: string;
	points: number;
}

export interface SkillInputProps extends React.HTMLAttributes<HTMLElement> {
	name: string;
	skills: ReadonlyArray<Skill>;
}

export function SkillInput(props: SkillInputProps) {
	const { name, skills, className, ...rest } = props;
	const groups = group(skills);

	return <div {...rest} className={classNames(className, style['skill'])}>
		<Select field={`${name}.id`} required >
			<option value="">未選択</option>
			{
				groups.map(({ category, skills }) =>
					<optgroup key={category} label={CATEGORY_NAME[category]}>
						{skills.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
					</optgroup>
				)
			}
		</Select>
		<Field name={`${name}.id`} subscription={{ value: true }} render={({ input: { value: id } }) =>
			<React.Fragment>
				<div className={style['base']}>
					{id ? <EvaluationText target={`@skill:${id}:base`} hash={null} /> : 0}
				</div>
				<NumberInput field={`${name}.points`} required min={0} max={99} step={1} />
				<div className={style['value']}>
					{id ? <EvaluationText target={`@skill:${id}`} hash={null} /> : 0}
				</div>
			</React.Fragment>
		} />
	</div>
}