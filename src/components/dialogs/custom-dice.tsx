import React from 'react';
import Form from "components/functions/form";
import { NumberInput } from "components/atoms/input";
import Button from "components/atoms/button";
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
	count: string;
	max: string;
	invalid: boolean;
}

export default class CustomDiceDialog extends React.Component<CustomDiceDialogProps, CustomDiceDialogState> {
	public constructor(props: CustomDiceDialogProps, context: any) {
		super(props, context);

		this.state = {
			count: this.props.count.toString(10),
			max: this.props.max.toString(10),
			invalid: false,
		};
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { count, max, invalid } = this.state;

		return <Dialog when={this.props.when} header={"Custom Dice"}>
			<Form onChange={this.handleFormChange} onSubmit={this.handleSubmit}>
				<div className={style['inputs']}>
					<NumberInput className={style['number']} name="count" min={1} max={100} step={1} value={count} onChange={this.handleInputChange} />
					D
					<NumberInput className={style['number']} name="max" min={1} max={1000} step={1} value={max} onChange={this.handleInputChange} />
				</div>
				<div className={style['buttons']}>
					<Button className={style['ok']} type="submit" disabled={invalid}>OK</Button>
					<Button className={style['cancel']} onClick={this.handleClick}>Cancel</Button>
				</div >
			</Form>
		</Dialog >
	}

	private handleFormChange(event: React.ChangeEvent<HTMLFormElement>): void {
		const target = event.currentTarget;
		const invalid = !target.checkValidity();
		this.setState({ invalid });
	}

	private handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const value = target.value;
		this.setState({ [name]: value } as any);
	}

	private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		const count = Number.parseInt(this.state.count, 10);
		const max = Number.parseInt(this.state.max, 10);

		this.props.onClose({ count, max });
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		this.props.onClose();
	}
}