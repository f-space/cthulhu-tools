import React from 'react';
import { Status, Attribute, History, Command } from "models/status";
import { generateUUID } from "models/utility";
import StatusDispatcher from "redux/dispatchers/status";
import { EvaluationProvider } from "components/shared/decorators/evaluation";
import { EvaluationText } from "components/shared/primitives/evaluation-text";
import { AttributeSection } from "./attribute-section";
import { SkillSection } from "./skill-section";
import { CommitDialog, CommitDialogResult } from "./commit-dialog";
import style from "./status-view.scss";

export interface StatusViewProps {
	status: Status;
	edit: boolean;
	dispatcher: StatusDispatcher;
}

interface StatusViewState {
	target?: Attribute;
}

export class StatusView extends React.Component<StatusViewProps, StatusViewState> {
	public constructor(props: StatusViewProps) {
		super(props);

		this.state = {};
		this.handleEdit = this.handleEdit.bind(this);
		this.handleClose = this.handleClose.bind(this);
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
				<CommitDialog open={Attribute.is(target)} target={target!} onClose={this.handleClose} />
			</section>
		</EvaluationProvider>
	}

	private handleEdit(target: Attribute): void {
		this.setState({ target });
	}

	private handleClose(result?: CommitDialogResult): void {
		if (result) {
			this.addCommand(result.command);
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
}