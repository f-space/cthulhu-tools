import React from 'react';
import { Form, UpdateEvent } from "components/functions/form";
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

export interface CustomDiceDialogState {
	count: { value: string, valid: boolean };
	max: { value: string, valid: boolean };
}

export default class CustomDiceDialog extends React.Component<CustomDiceDialogProps, CustomDiceDialogState> {
	public constructor(props: CustomDiceDialogProps, context: any) {
		super(props, context);

		this.state = {
			count: { value: this.props.count.toString(10), valid: false },
			max: { value: this.props.max.toString(10), valid: false },
		};
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { count, max } = this.state;
		const invalid = [count, max].some(prop => !prop.valid);

		return <Dialog when={this.props.when} header={"Custom Dice"}>
			<Form onSubmit={this.handleSubmit}>
				<div className={style['inputs']}>
					<NumberInput className={style['number']} name="count" min={1} max={100} step={1} value={count.value} onUpdate={this.handleUpdate} />
					D
					<NumberInput className={style['number']} name="max" min={1} max={1000} step={1} value={max.value} onUpdate={this.handleUpdate} />
				</div>
				<div className={style['buttons']}>
					<SubmitButton className={style['ok']} disabled={invalid}>OK</SubmitButton>
					<Button className={style['cancel']} onClick={this.handleClick}>Cancel</Button>
				</div >
			</Form>
		</Dialog >
	}

	private handleUpdate(event: UpdateEvent<HTMLInputElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const value = target.value;
		const valid = target.validity.valid;
		this.setState({ [name]: { value, valid } } as any);
	}

	private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		const count = Number.parseInt(this.state.count.value, 10);
		const max = Number.parseInt(this.state.max.value, 10);

		this.props.onClose({ count, max });
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		this.props.onClose();
	}
}