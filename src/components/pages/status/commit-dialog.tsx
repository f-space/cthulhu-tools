import React from 'react';
import { Form, Field } from 'react-final-form';
import classNames from "classnames";
import { Attribute, AttributeType, Skill, Commit, Operation, Expression } from "models/status";
import { TextInput, NumberInput, Radio } from "components/shared/widgets/input";
import { Button, SubmitButton } from "components/shared/widgets/button";
import { Dialog } from "components/shared/templates/dialog";
import style from "./commit-dialog.scss";

enum TargetType {
	Integer = 'integer',
	Number = 'number',
	Text = 'text',
}

export interface CommitDialogResult {
	commit: Commit;
}

export interface CommitDialogProps {
	open: boolean;
	target: Attribute | Skill;
	onClose: (result?: CommitDialogResult) => void;
}

interface CommitDialogState {
	initialValues: FormValues;
}

interface FormValues {
	mode: 'set' | 'add' | 'expression';
	message?: string;
	set?: SetValues;
	add?: AddValues;
	expression?: ExpressionValues;
}

interface SetValues {
	value: number | string;
}

interface AddValues {
	value: number;
}

interface ExpressionValues {
	value: string;
}

export class CommitDialog extends React.Component<CommitDialogProps, CommitDialogState> {
	public constructor(props: CommitDialogProps) {
		super(props);

		this.state = { initialValues: { mode: 'set' } };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { open, target } = this.props;
		const type = this.getTargetType(target);

		return <Dialog open={open} header={"Commit"}>
			{
				() => <Form {...this.state} onSubmit={this.handleSubmit} render={({ handleSubmit, invalid }) =>
					<form onSubmit={handleSubmit}>
						<div className={classNames(style['inputs'], style[type])}>
							<div className={style['name']}>{target.name}</div>
							<div className={style['methods']}>
								<div className={classNames(style['method'], style['set'])}>
									<div className={style['caption']}>
										<Radio field="mode" value="set" />
										<span>代入</span>
									</div>
									<div className={style['value']}>
										<Field name="mode" subscription={{ value: true }} render={({ input: { value } }) =>
											this.renderInput(type, "set.value", value !== 'set')
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
											this.renderInput(type, "add.value", value !== 'add')
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
											<TextInput
												field={{
													name: "expression.value",
													validate: value => Expression.parse(value) ? undefined : "無効な式",
												}}
												placeholder={
													type !== TargetType.Text
														? "e.g. floor(($_ + 1) * 2 / 3)"
														: "e.g. \"{$_}abc{1 + 1}\""
												}
												disabled={value !== 'expression'}
												autoComplete="off"
												required />
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

	private renderInput(type: TargetType, field: string, disabled: boolean) {
		switch (type) {
			case TargetType.Integer: return <NumberInput field={field} disabled={disabled} required step="1" />
			case TargetType.Number: return <NumberInput field={field} disabled={disabled} required />
			case TargetType.Text: return <TextInput field={field} disabled={disabled} autoComplete="off" />
		}
	}

	private handleSubmit(values: any): void {
		const target = this.getTargetRef(this.props.target);
		const commit = this.createCommit(target, values);

		this.props.onClose({ commit });
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		this.props.onClose();
	}

	private getTargetType(target: Attribute | Skill): TargetType {
		if (Attribute.is(target)) {
			switch (target.type) {
				case AttributeType.Integer: return TargetType.Integer;
				case AttributeType.Number: return TargetType.Number;
				case AttributeType.Text: return TargetType.Text;
				default: throw new Error('unreachable code.');
			}
		} else {
			return TargetType.Integer;
		}
	}

	private getTargetRef(target: Attribute | Skill): string {
		return Attribute.is(target)
			? `@attr:${target.id}`
			: `@skill:${target.id}:points`;
	}

	private createCommit(target: string, values: FormValues): Commit {
		const operation = this.createOperation(target, values);

		return new Commit({
			parent: null,
			time: Date.now(),
			message: values.message,
			operations: [operation],
		});
	}

	private createOperation(target: string, values: FormValues): Operation {
		switch (values.mode) {
			case 'set': return this.createSetOperation(target, values.set!);
			case 'add': return this.createAddOperation(target, values.add!);
			case 'expression': return this.createExpressionOperation(target, values.expression!);
			default: throw new Error('unreachable code.');
		}
	}

	private createSetOperation(target: string, values: SetValues): Operation {
		const value = values.value;
		const expression = typeof value === 'number'
			? Expression.parse(String(Number.isFinite(value) ? value : 0))
			: Expression.parse(`"${String(value).replace(/[{}`\\]/g, "\\$1")}"`);

		if (!expression) throw new Error("unreachable code.");

		return new Operation({ target, value: expression });
	}

	private createAddOperation(target: string, values: AddValues): Operation {
		const value = values.value;
		const expression = Expression.parse(`$_+${Number.isFinite(value) ? value : 0}`);

		if (!expression) throw new Error("unreachable code.");

		return new Operation({ target, value: expression });
	}

	private createExpressionOperation(target: string, values: ExpressionValues): Operation {
		const value = values.value;
		const expression = Expression.parse(value);

		if (!expression) throw new Error("unreachable code.");

		return new Operation({ target, value: expression });
	}
}