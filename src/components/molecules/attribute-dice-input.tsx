import React from 'react';
import { Field } from 'react-final-form';
import { DiceInputMethod } from "models/status";
import DiceImage from "components/atoms/dice-image";
import style from "styles/molecules/attribute-dice-input.scss";

export interface AttributeDiceInputProps {
	name: string;
	method: DiceInputMethod;
}

export default function AttributeDiceInput(props: AttributeDiceInputProps) {
	const { method, name } = props;

	return <Field name={name} render={({ input: { value, onChange } }) => {
		const faces = method.validate(value) ? value : method.default;
		const dices = method.dices.map((dice, index) => dice.display(faces[index]));

		return <div className={style['dice-input']}>
			{
				dices.map((group, groupIndex) =>
					<div key={groupIndex} className={style['dice-set']}>
						{
							group.map((dice, diceIndex) =>
								<DiceImage key={diceIndex} type={dice.type} face={dice.face} onClick={() => {
									onChange(method.dices.map(dice => Math.floor(Math.random() * dice.faces)));
								}} />
							)
						}
					</div>
				)
			}
		</div>
	}} />
}