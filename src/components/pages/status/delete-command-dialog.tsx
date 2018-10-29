import React from 'react';
import { Command } from "models/status";
import { Button } from "components/shared/widgets/button";
import { Dialog } from "components/shared/templates/dialog";
import style from "./delete-command-dialog.scss";

export interface DeleteCommandDialogResult {
	command: Command;
}

export interface DeleteCommandDialogProps {
	open: boolean;
	target: Command;
	onClose: (result?: DeleteCommandDialogResult) => void;
}

export class DeleteCommandDialog extends React.Component<DeleteCommandDialogProps> {
	public constructor(props: DeleteCommandDialogProps) {
		super(props);

		this.handleClickOK = this.handleClickOK.bind(this);
		this.handleClickCancel = this.handleClickCancel.bind(this);
	}

	public render() {
		const { open, target } = this.props;

		return <Dialog open={open} header={"Delete Command"}>
			{
				() => <>
					<div className={style['text']}>次の変更を削除します。</div>
					<div className={style['details']}>
						<div className={style['message']}>{target.message || "<no message>"}</div>
						<ul className={style['operations']}>
							{
								target.operations.map((op, n) =>
									<li key={n} className={'operation'}>{`<${op.target}> ${op.value}`}</li>
								)
							}
						</ul>
					</div>
					<div className={style['buttons']}>
						<Button className={style['ok']} commit onClick={this.handleClickOK}>OK</Button>
						<Button className={style['cancel']} onClick={this.handleClickCancel}>Cancel</Button>
					</div >
				</>
			}
		</Dialog >
	}

	private handleClickOK(): void {
		this.props.onClose({ command: this.props.target });
	}

	private handleClickCancel(): void {
		this.props.onClose();
	}
}