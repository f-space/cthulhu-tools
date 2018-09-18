import React from 'react';
import { Form } from 'react-final-form';
import { NumberInput } from "components/shared/widgets/input";
import { Button, SubmitButton } from "components/shared/widgets/button";
import { Dialog } from "components/shared/templates/dialog";
import style from "./custom-dice-dialog.scss";

export interface CustomDiceDialogResult {
	count: number;
	max: number;
}

export interface CustomDiceDialogProps {
	open: boolean;
	count: number;
	max: number;
	onClose(result?: CustomDiceDialogResult): void;
}

export class CustomDiceDialog extends React.Component<CustomDiceDialogProps> {
	public constructor(props: CustomDiceDialogProps) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { count, max } = this.props;

		return <Dialog open={this.props.open} header={"Custom Dice"}>
			<Form initialValues={{ count, max }} onSubmit={this.handleSubmit} render={({ handleSubmit, valid }) =>
				<form onSubmit={handleSubmit}>
					<div className={style['inputs']}>
						<NumberInput field="count" className={style['number']} required min={1} max={100} step={1} />
						D
						<NumberInput field="max" className={style['number']} required min={1} max={1000} step={1} />
					</div>
					<div className={style['buttons']}>
						<SubmitButton className={style['ok']} disabled={!valid} commit>OK</SubmitButton>
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