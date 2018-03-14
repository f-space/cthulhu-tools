import React from 'react';
import { Form, Field, FormSpy } from "components/functions/form";
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

const NumberField = Field.type<number>();

export default class CustomDiceDialog extends React.Component<CustomDiceDialogProps> {
	public constructor(props: CustomDiceDialogProps, context: any) {
		super(props, context);

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { count, max } = this.props;

		return <Dialog when={this.props.when} header={"Custom Dice"}>
			<Form initialValues={{ count, max }} onSubmit={this.handleSubmit} render={props =>
				<form {...props}>
					<div className={style['inputs']}>
						<NumberField name="count" render={props =>
							<NumberInput {...props} className={style['number']} required min={1} max={100} step={1} />
						} />
						D
						<NumberField name="max" render={props =>
							<NumberInput {...props} className={style['number']} required min={1} max={1000} step={1} />
						} />
					</div>
					<div className={style['buttons']}>
						<FormSpy dependency={{ valid: true }} render={({ valid }) =>
							<SubmitButton className={style['ok']} disabled={!valid}>OK</SubmitButton>
						} />
						<Button className={style['cancel']} onClick={this.handleClick}>Cancel</Button>
					</div >
				</form>
			} />
		</Dialog >
	}

	private handleSubmit(result: CustomDiceDialogResult): void {
		this.props.onClose(result);
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		this.props.onClose();
	}
}