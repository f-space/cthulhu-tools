import React from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { Skill } from 'models/status';
import { NumberInput } from "components/atoms/input";
import { Select } from "components/atoms/select";
import { EvaluationText } from "components/atoms/evaluation-text";
import style from "styles/molecules/skill-input.scss";

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

	return <div {...rest} className={classNames(className, style['skill'])}>
		<Select className={style['id']} field={`${name}.id`} required >
			<option value="">未選択</option>
			{skills.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
		</Select>
		<Field name={`${name}.id`} subscription={{ value: true }} render={({ input: { value: id } }) =>
			<React.Fragment>
				<div className={style['base']}>
					<EvaluationText id={id} modifier="base" hash={null} />
				</div>
				<NumberInput className={style['points']} field={`${name}.points`} required min={0} max={99} step={1} />
				<div className={style['value']}>
					<EvaluationText id={id} hash={null} />
				</div>
			</React.Fragment>
		} />
	</div>
}