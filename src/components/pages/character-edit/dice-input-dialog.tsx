import React from 'react';
import { Dice } from "models/dice";
import { Button } from "components/shared/widgets/button";
import { RollButton } from "components/shared/widgets/roll-button";
import { DiceImage } from "components/shared/widgets/dice-image";
import { Dialog } from "components/shared/templates/dialog";
import { DiceImageConsumer } from "components/shared/templates/dice-image-guard";
import { DiceRoll } from "components/shared/templates/dice-roll";
import style from "./dice-input-dialog.scss";

export interface DiceInputDialogResult {
	value: number[];
}

export interface DiceInputDialogProps {
	open: boolean;
	dices: ReadonlyArray<Dice>;
	value: ReadonlyArray<number>;
	onClose(result?: DiceInputDialogResult): void;
}

interface DiceInputDialogState {
	value: number[];
	rolling: boolean;
}

export class DiceInputDialog extends React.Component<DiceInputDialogProps, DiceInputDialogState> {
	public constructor(props: DiceInputDialogProps) {
		super(props);

		this.state = { value: Array.from(props.value), rolling: false };
		this.handleClickDice = this.handleClickDice.bind(this);
		this.handleClickRoll = this.handleClickRoll.bind(this);
		this.handleClickOK = this.handleClickOK.bind(this);
		this.handleClickCancel = this.handleClickCancel.bind(this);
		this.updateValue = this.updateValue.bind(this);
	}

	public render() {
		const { dices } = this.props;
		const { value, rolling } = this.state;
		const display = dices.map((dice, i) => dice.display(value[i]));

		return <DiceImageConsumer>
			{
				store => store && <Dialog open={this.props.open} header={"Dice Input"}>
					{
						() => <>
							<div className={style['inputs']}>
								<div className={style['dices']}>
									{
										display.map((group, groupIndex) =>
											<div key={groupIndex} className={style['group']} onClick={this.handleClickDice} data-index={groupIndex}>
												{
													group.map((dice, diceIndex) =>
														<DiceImage key={diceIndex} className={style['dice']} store={store} type={dice.type} face={dice.face} />)
												}
											</div>
										)
									}
								</div>
								<RollButton className={style['roll']} disabled={rolling} onClick={this.handleClickRoll} />
							</div>
							<div className={style['buttons']}>
								<Button className={style['ok']} disabled={rolling} commit onClick={this.handleClickOK}>OK</Button>
								<Button className={style['cancel']} onClick={this.handleClickCancel}>Cancel</Button>
							</div >
							<DiceRoll active={rolling} dices={dices} faces={value} callback={this.updateValue} />
						</>
					}
				</Dialog >
			}
		</DiceImageConsumer>
	}

	private handleClickDice(event: React.MouseEvent<HTMLElement>): void {
		const { dices } = this.props;
		const index = parseInt(event.currentTarget.dataset['index']!);

		this.setState(state => {
			const dice = dices[index];
			const value = Array.from(state.value);
			value[index] = (value[index] + 1) % dice.faces;
			return { value };
		});
	}

	private handleClickRoll(): void {
		this.setState({ rolling: true });
	}

	private handleClickOK(): void {
		const { value } = this.state;

		this.props.onClose({ value });
	}

	private handleClickCancel(): void {
		this.props.onClose();
	}

	private updateValue(value: number[], final: boolean): void {
		this.setState({ value, rolling: !final });
	}
}