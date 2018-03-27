import React from 'react';
import { Field } from 'react-final-form';
import classNames from 'classnames';
import { Skill } from 'models/status';
import { deepClone } from 'models/utility';
import { NumberInput } from "components/atoms/input";
import { Select } from "components/atoms/select";
import style from "styles/molecules/skill-input.scss";

export interface SkillInputValue {
	id: string;
	points: number;
}

export interface SkillInputProps extends React.HTMLAttributes<HTMLElement> {
	name: string;
	skills: ReadonlyArray<Skill>;
	evaluate(id: string, base?: boolean): React.ReactNode;
}

export default function SkillInput(props: SkillInputProps) {
	const { name, skills, evaluate, className, ...rest } = props;

	return <div {...rest} className={classNames(className, style['skill'])}>
		<Select className={style['id']} field={`${name}.id`} required >
			<option value="" disabled>未選択</option>
			{skills.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
		</Select>
		<Field name={`${name}.id`} subscription={{ value: true }} render={({ input: { value: id } }) =>
			<React.Fragment>
				<div className={style['base']}>{evaluate(id, true)}</div>
				<NumberInput className={style['points']} field={`${name}.points`} required min={0} max={99} step={1} />
				<div className={style['value']}>{evaluate(id)}</div>
			</React.Fragment>
		} />
	</div>
}