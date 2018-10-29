import React from 'react';
import { Form, Field } from 'react-final-form';
import classNames from "classnames";
import { Attribute, AttributeType, Command, Operation, Expression } from "models/status";
import { TextInput, NumberInput, Radio } from "components/shared/widgets/input";
import { Button, SubmitButton } from "components/shared/widgets/button";
import { Dialog } from "components/shared/templates/dialog";
import style from "./commit-dialog.scss";

export interface CommitDialogResult {
	command: Command;
}

export interface CommitDialogProps {
	open: boolean;
	target: Attribute;
	onClose: (result?: CommitDialogResult) => void;
}

export class CommitDialog extends React.Component<CommitDialogProps> {
	public constructor(props: CommitDialogProps) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { open, target } = this.props;

		return <Dialog open={open} header={"Commit"}>
			{
				() => <Form initialValues={{ mode: 'set' }} onSubmit={this.handleSubmit} render={({ handleSubmit, invalid }) =>
					<form onSubmit={handleSubmit}>
						<div className={classNames(style['inputs'], style[target.type])}>
							<div className={style['name']}>{target.name}</div>
							<div className={style['methods']}>
								<div className={classNames(style['method'], style['set'])}>
									<div className={style['caption']}>
										<Radio field="mode" value="set" />
										<span>代入</span>
									</div>
									<div className={style['value']}>
										<Field name="mode" subscription={{ value: true }} render={({ input: { value } }) =>
											this.renderInput(target, "set.value", value !== 'set')
										} />
									</div>
								</div>
								<div className={classNames(style['method'], style['add'])}>
									<div className={style['caption']}>
										<Radio field="mode" value="add" />
										<span>加算</span>
									</div>
									<div className={style['value']}>
										<Field name="mode" subscription={{ value: true }} render={({ input: { value } }) =>
											this.renderInput(target, "add.value", value !== 'add')
										} />
									</div>
								</div>
								<div className={classNames(style['method'], style['expression'])}>
									<div className={style['caption']}>
										<Radio field="mode" value="expression" />
										<span>式</span>
										<span className={style['note']}>$_ : 現在値</span>
									</div>
									<div className={style['value']}>
										<Field name="mode" subscription={{ value: true }} render={({ input: { value } }) =>
											<TextInput field={{
												name: "expression.value",
												validate: value => Expression.parse(value) ? undefined : "無効な式",
											}} disabled={value !== 'expression'} required />
										} />
									</div>
								</div>
							</div>
							<div className={style['message']}>
								<span>メッセージ</span>
								<TextInput field="message" autoComplete="off" />
							</div>
						</div>
						<div className={style['buttons']}>
							<SubmitButton className={style['ok']} disabled={invalid} commit>OK</SubmitButton>
							<Button className={style['cancel']} onClick={this.handleClick}>Cancel</Button>
						</div >
					</form>
				} />
			}
		</Dialog >
	}

	private renderInput(attribute: Attribute, field: string, disabled: boolean) {
		switch (attribute.type) {
			case AttributeType.Integer: return <NumberInput field={field} disabled={disabled} required step="1" />
			case AttributeType.Number: return <NumberInput field={field} disabled={disabled} required />
			case AttributeType.Text: return <TextInput field={field} disabled={disabled} autoComplete="off" />
		}
	}

	private handleSubmit(values: any): void {
		const target = `@attr:${this.props.target.id}`;
		const command = this.createCommand(target, values);

		this.props.onClose({ command });
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		this.props.onClose();
	}

	private createCommand(target: string, values: any): Command {
		const operation = this.createOperation(target, values);

		return new Command({
			parent: null,
			time: Date.now(),
			message: values.message,
			operations: [operation],
		});
	}

	private createOperation(target: string, values: any): Operation {
		switch (values.mode) {
			case 'set': return this.createSetOperation(target, values.set);
			case 'add': return this.createAddOperation(target, values.add);
			case 'expression': return this.createExpressionOperation(target, values.expression);
			default: throw new Error('unreachable code.');
		}
	}

	private createSetOperation(target: string, values: any): Operation {
		const value = values.value;
		const expression = typeof value === 'number'
			? Expression.parse(String(Number.isFinite(value) ? value : 0))
			: Expression.parse(`"${String(value).replace(/[{}`\\]/g, "\\$1")}"`);

		if (!expression) throw new Error("unreachable code.");

		return new Operation({ target, value: expression });
	}

	private createAddOperation(target: string, values: any): Operation {
		const value = values.value;
		const expression = Expression.parse(`$_+${Number.isFinite(value) ? value : 0}`);

		if (!expression) throw new Error("unreachable code.");

		return new Operation({ target, value: expression });
	}

	private createExpressionOperation(target: string, values: any): Operation {
		const value = values.value;
		const expression = Expression.parse(value);

		if (!expression) throw new Error("unreachable code.");

		return new Operation({ target, value: expression });
	}
}