import React from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { Skill } from "models/status";
import { EvaluationAsync } from "components/shared/decorators/evaluation-async";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { SkillInput, SkillInputValue } from "./skill-input";
import style from "./skill-params-edit.scss";

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
				<div className={style['source']}>
					<span>職業</span>
					<EvaluationText target="@attr:oskp" hash={null} />
				</div>
				<div className={style['source']}>
					<span>趣味</span>
					<EvaluationText target="@attr:hskp" hash={null} />
				</div>
				<div className={style['total']}>
					<span>合計</span>
					<EvaluationAsync mode='expression' target="@attr:oskp + @attr:hskp" hash={null}>
						{
							result => <Field name={name} subscription={{ value: true }} render={({ input: { value } }) => {
								const skills = value as SkillInputValue[];
								const available = result && result[0];
								const consumed = available !== undefined ? skills.reduce((sum, skill) => sum + skill.points, 0) : undefined;
								const full = available !== undefined && consumed !== undefined && consumed === available;
								const over = available !== undefined && consumed !== undefined && consumed > available;

								return <span className={classNames(style['usage'], { [style['full']]: full, [style['over']]: over })}>
									<span className={style['consumed']}>{consumed !== undefined ? consumed : "-"}</span>
									<span>/</span>
									<span className={style['available']}>{available !== undefined ? available : "-"}</span>
								</span>

							}} />
						}
					</EvaluationAsync>
				</div>
			</div>
			<FieldArray name={name} render={({ fields }) =>
				<React.Fragment>
					<div className={style['commands']}>
						<button className={style['command']} type="button" aria-label="追加" onClick={() => fields.push({ id: "", points: 0 })}>
							<FontAwesomeIcon icon="plus" />
						</button>
						<button className={style['command']} type="button" aria-label="削除" onClick={() => fields.pop()}>
							<FontAwesomeIcon icon="minus" />
						</button>
					</div>
					<div className={style['skills']}>
						<div className={style['help']}>
							<span className={style['icon']} aria-label="追加ボタン"><FontAwesomeIcon icon="plus" /></span>
							<span>で技能を追加</span>
						</div>
						{
							fields.map((name, index) =>
								<SkillInput key={name} name={name} index={index + 1} skills={skills || []} />
							)
						}
					</div>
				</React.Fragment>
			} />
		</React.Fragment >
	}
}