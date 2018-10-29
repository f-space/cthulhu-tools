import React from 'react';
import { Status, Attribute, History, Commit } from "models/status";
import { generateUUID } from "models/utility";
import StatusDispatcher from "redux/dispatchers/status";
import { EvaluationProvider } from "components/shared/decorators/evaluation";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { AttributeSection } from "./attribute-section";
import { SkillSection } from "./skill-section";
import { HistorySection } from "./history-section";
import { CommitDialog, CommitDialogResult } from "./commit-dialog";
import { AmendDialog, AmendDialogResult } from "./amend-dialog";
import style from "./status-view.scss";

export interface StatusViewProps {
	status: Status;
	edit: boolean;
	dispatcher: StatusDispatcher;
}

interface StatusViewState {
	target?: Attribute | Commit;
}

export class StatusView extends React.Component<StatusViewProps, StatusViewState> {
	public constructor(props: StatusViewProps) {
		super(props);

		this.state = {};
		this.handleEdit = this.handleEdit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleCloseCommitDialog = this.handleCloseCommitDialog.bind(this);
		this.handleCloseAmendDialog = this.handleCloseAmendDialog.bind(this);
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
				<AmendDialog open={target instanceof Commit} target={target as Commit} onClose={this.handleCloseAmendDialog} />
			</section>
		</EvaluationProvider>
	}

	private handleEdit(target: Attribute): void {
		this.setState({ target });
	}

	private handleDelete(target: Commit): void {
		this.setState({ target });
	}

	private handleCloseCommitDialog(result?: CommitDialogResult): void {
		if (result) {
			this.addCommit(result.commit);
		}

		this.setState({ target: undefined });
	}

	private handleCloseAmendDialog(result?: AmendDialogResult): void {
		if (result) {
			this.deleteCommit(result.commit);
		}

		this.setState({ target: undefined });
	}

	private async addCommit(commit: Commit): Promise<void> {
		const { dispatcher } = this.props;

		const history = await this.getOrCreateHistory();

		const newCommit = commit.set({ parent: history.head });
		history.commit(newCommit);
		history.head = newCommit.hash;

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

	private async deleteCommit(commit: Commit): Promise<void> {
		const { status, dispatcher } = this.props;

		const history = status.context.history;
		if (history && history.find(commit.hash)) {
			const rest: Commit[] = [];
			for (const current of history.trace()) {
				if (current.hash === commit.hash) break;
				rest.push(current);
			}

			let parent = commit.parent;
			for (let i = rest.length - 1; i >= 0; i--) {
				const newCommit = new Commit({
					...rest[i],
					parent,
				});
				history.commit(newCommit);
				parent = newCommit.hash;
			}

			history.head = parent;
			history.gc();

			await dispatcher.history.update(history);
		}
	}
}