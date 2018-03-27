import React from 'react';
import { Form } from 'react-final-form';
import { NumberInput } from "components/atoms/input";
import { Button, SubmitButton } from "components/atoms/button";
import Dialog from "components/templates/dialog";
import style from "styles/dialogs/custom-dice-dialog.scss";

export interface CustomDiceDialogResult {
	count: number;
	max: number;
}

export interface CustomDiceDialogProps {
	when: boolean;
	count: number;
	max: number;
	onClose(result?: CustomDiceDialogResult): void;
}

export default class CustomDiceDialog extends React.Component<CustomDiceDialogProps> {
	public constructor(props: CustomDiceDialogProps, context: any) {
		super(props, context);

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { count, max } = this.props;

		return <Dialog when={this.props.when} header={"Custom Dice"}>
			<Form initialValues={{ count, max }} onSubmit={this.handleSubmit} render={({ handleSubmit, valid }) =>
				<form onSubmit={handleSubmit}>
					<div className={style['inputs']}>
						<NumberInput field="count" className={style['number']} required min={1} max={100} step={1} />
						D
						<NumberInput field="max" className={style['number']} required min={1} max={1000} step={1} />
					</div>
					<div className={style['buttons']}>
						<SubmitButton className={style['ok']} disabled={!valid}>OK</SubmitButton>
						<Button className={style['cancel']} onClick={this.handleClick}>Cancel</Button>
					</div >
				</form>
			} />
		</Dialog >
	}

	private handleSubmit(result: object): void {
		this.props.onClose(result as CustomDiceDialogResult);
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		this.props.onClose();
	}
}