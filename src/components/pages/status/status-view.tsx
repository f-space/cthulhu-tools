import React from 'react';
import { Status, Attribute, History, Command } from "models/status";
import { generateUUID } from "models/utility";
import StatusDispatcher from "redux/dispatchers/status";
import { EvaluationProvider } from "components/shared/decorators/evaluation";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { AttributeSection } from "./attribute-section";
import { SkillSection } from "./skill-section";
import { HistorySection } from "./history-section";
import { CommitDialog, CommitDialogResult } from "./commit-dialog";
import { DeleteCommandDialog, DeleteCommandDialogResult } from "./delete-command-dialog";
import style from "./status-view.scss";

export interface StatusViewProps {
	status: Status;
	edit: boolean;
	dispatcher: StatusDispatcher;
}

interface StatusViewState {
	target?: Attribute | Command;
}

export class StatusView extends React.Component<StatusViewProps, StatusViewState> {
	public constructor(props: StatusViewProps) {
		super(props);

		this.state = {};
		this.handleEdit = this.handleEdit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleCloseCommitDialog = this.handleCloseCommitDialog.bind(this);
		this.handleCloseDeleteCommandDialog = this.handleCloseDeleteCommandDialog.bind(this);
	}

	public render() {
		const { status, edit } = this.props;
		const { target } = this.state;
		const chain = status.chain;
		const hash = status.current;

		return <EvaluationProvider chain={chain}>
			<section className={style['status']}>
				<h3 className={style['name']}><EvaluationText target="@attr:name" hash={hash} /></h3>
				<AttributeSection status={status} edit={edit} onEdit={this.handleEdit} />
				<SkillSection status={status} />
				<HistorySection status={status} edit={edit} onDelete={this.handleDelete} />
				<CommitDialog open={Attribute.is(target)} target={target as Attribute} onClose={this.handleCloseCommitDialog} />
				<DeleteCommandDialog open={target instanceof Command} target={target as Command} onClose={this.handleCloseDeleteCommandDialog} />
			</section>
		</EvaluationProvider>
	}

	private handleEdit(target: Attribute): void {
		this.setState({ target });
	}

	private handleDelete(target: Command): void {
		this.setState({ target });
	}

	private handleCloseCommitDialog(result?: CommitDialogResult): void {
		if (result) {
			this.addCommand(result.command);
		}

		this.setState({ target: undefined });
	}

	private handleCloseDeleteCommandDialog(result?: DeleteCommandDialogResult): void {
		if (result) {
			this.deleteCommand(result.command);
		}

		this.setState({ target: undefined });
	}

	private async addCommand(source: Command): Promise<void> {
		const { dispatcher } = this.props;

		const history = await this.getOrCreateHistory();

		const command = source.set({ parent: history.head });
		history.commit(command);
		history.head = command.hash;

		await dispatcher.history.update(history);
	}

	private async getOrCreateHistory(): Promise<History> {
		const { status, dispatcher } = this.props;

		if (status.context.history) {
			return status.context.history;
		} else {
			const character = status.context.character;
			const history = new History({
				uuid: generateUUID(),
				name: `${status.get("@attr:name")}'s History`,
				head: null,
			});

			await dispatcher.history.create(history);
			await dispatcher.character.update(character.set({ history: history.uuid }));

			return history;
		}
	}

	private async deleteCommand(command: Command): Promise<void> {
		const { status, dispatcher } = this.props;

		const history = status.context.history;
		if (history && history.command(command.hash)) {
			const rest: Command[] = [];
			for (const current of history.trace()) {
				if (current.hash === command.hash) break;
				rest.push(current);
			}

			let parent = command.parent;
			for (let i = rest.length - 1; i >= 0; i--) {
				const newCommand = new Command({
					...rest[i],
					parent,
				});
				history.commit(newCommand);
				parent = newCommand.hash;
			}

			history.head = parent;
			history.gc();

			await dispatcher.history.update(history);
		}
	}
}