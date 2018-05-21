import React from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { Skill } from "models/status";
import { Button } from "components/atoms/button";
import { EvaluationText } from "components/atoms/evaluation-text";
import { SkillInput, SkillInputValue } from "components/molecules/skill-input";
import style from "styles/organisms/skill-params-edit.scss";

export interface SkillParamsEditValue extends Array<SkillInputValue> { }

export interface SkillParamsEditProps {
	name: string;
	skills: ReadonlyArray<Skill>;
}

export class SkillParamsEdit extends React.PureComponent<SkillParamsEditProps> {
	public render() {
		const { name, skills } = this.props;

		return <React.Fragment>
			<div className={style['point-stats']}>
				<Field name={name} subscription={{ value: true }} render={({ input: { value } }) => {
					const skills = value as SkillInputValue[];
					const consumed = skills.reduce((sum, skill) => sum + skill.points, 0);

					return <span className={style['consumed']}>{consumed}</span>
				}} />
				<span>/</span>
				<span className={style['available']}>
					<EvaluationText expression="oskp + hskp" hash={null} />
				</span>
			</div>
			<FieldArray name={name} render={({ fields }) =>
				<React.Fragment>
					<div className={style['commands']}>
						<Button onClick={() => fields.push({ id: "", points: 0 })}>追加</Button>
						<Button onClick={() => fields.pop()}>削除</Button>
					</div>
					{
						fields.map((name, index) =>
							<SkillInput key={name} name={name} skills={skills || []} />
						)
					}
				</React.Fragment>
			} />
		</React.Fragment>
	}
}