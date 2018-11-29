import React from 'react';
import { Field } from 'react-final-form';
import { Dice } from "models/dice";
import { DiceInputMethod } from "models/status";
import { DiceImage } from "components/shared/widgets/dice-image";
import { DiceImageConsumer } from "components/shared/templates/dice-image-guard";
import { DiceInputDialog, DiceInputDialogResult } from "../dice-input-dialog";
import style from "./dice-input.scss";

export interface AttributeDiceInputProps {
	name: string;
	method: DiceInputMethod;
}

export function AttributeDiceInput(props: AttributeDiceInputProps) {
	const { method, name } = props;

	return <Field name={name} subscription={{ value: true }} render={({ input: { value, onChange } }) => {
		const dices = method.dices;
		const faces = method.validate(value) ? value : method.default;

		return <AttributeDiceInputInner dices={dices} faces={faces} onChange={onChange} />
	}} />
}

interface AttributeDiceInputInnerProps {
	dices: ReadonlyArray<Dice>;
	faces: ReadonlyArray<number>;
	onChange: (value: number[]) => void;
}

interface AttributeDiceInputInnerState {
	openDialog: boolean;
}

class AttributeDiceInputInner extends React.Component<AttributeDiceInputInnerProps, AttributeDiceInputInnerState>{
	public constructor(props: AttributeDiceInputInnerProps) {
		super(props);

		this.state = { openDialog: false };
		this.handleClick = this.handleClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	public render() {
		const { dices, faces } = this.props;
		const { openDialog } = this.state;

		const display = dices.map((dice, index) => dice.display(faces[index]));

		return <DiceImageConsumer>
			{
				store => store && <React.Fragment>
					<div className={style['dice-input']} onClick={this.handleClick}>
						{
							display.map((group, groupIndex) =>
								<div key={groupIndex} className={style['group']}>
									{
										group.map((dice, diceIndex) =>
											<DiceImage key={diceIndex} className={style['dice']} store={store} type={dice.type} face={dice.face} />
										)
									}
								</div>
							)
						}
					</div>
					<DiceInputDialog open={openDialog} dices={dices} value={faces} onClose={this.handleClose} />
				</React.Fragment>
			}
		</DiceImageConsumer>

	}

	private handleClick(): void {
		this.setState({ openDialog: true });
	}

	private handleClose(result?: DiceInputDialogResult): void {
		if (result) {
			this.props.onChange(result.value);
		}

		this.setState({ openDialog: false });
	}
}