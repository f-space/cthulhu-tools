import React from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { Skill } from 'models/status';
import { SkillGroup } from "components/shared/decorators/skill-group";
import { getSkillCategoryName } from "components/shared/primitives/skill-category";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { NumberInput } from "components/shared/widgets/input";
import { Select } from "components/shared/widgets/select";
import style from "./skill-input.scss";

export interface SkillInputValue {
	id: string;
	points: number;
}

export interface SkillInputProps extends React.HTMLAttributes<HTMLElement> {
	name: string;
	index: number;
	skills: ReadonlyArray<Skill>;
}

export function SkillInput(props: SkillInputProps) {
	const { name, index, skills, className, ...rest } = props;

	return <div {...rest} className={classNames(className, style['skill'])}>
		<span className={style['index']}>{`${index}.`}</span>
		<Select field={`${name}.id`} required >
			<option value="">未選択</option>
			<SkillGroup skills={skills}>
				{
					({ category, skills }) => <optgroup key={category} label={getSkillCategoryName(category)}>
						{skills.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
					</optgroup>
				}
			</SkillGroup>
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