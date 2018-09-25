import React from 'react';
import { Link } from 'react-router-dom';
import { History } from 'history';
import { FormApi } from 'final-form';
import { Form, FormSpy } from 'react-final-form';
import { DataProvider, Status } from "models/status";
import { generateUUID } from "models/utility";
import StatusDispatcher from "redux/dispatchers/status";
import { SelectableList } from "components/shared/widgets/selectable-list";
import { CommandList } from "components/shared/widgets/command-list";
import { Page } from "components/shared/templates/page";
import { VisibilityToggle } from "./visibility-toggle";
import style from "./template.scss";

export interface CharacterManagementTemplateProps {
	provider: DataProvider;
	statusList: Status[];
	dispatcher: StatusDispatcher;
	history: History;
}

type CommandType = "delete" | "clone" | "edit" | "import" | "export";

interface FormValues {
	command?: CommandType;
	selection: string[];
}

export class CharacterManagementTemplate extends React.Component<CharacterManagementTemplateProps> {
	public constructor(props: CharacterManagementTemplateProps) {
		super(props);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	public render() {
		const initialValues = { selection: [] };

		return <Page id="character-management" heading="キャラクター管理" navs={
			<Link to="/status/character-edit">作成</Link>
		} flexible>
			<Form initialValues={initialValues} onSubmit={this.handleSubmit} render={({ handleSubmit }) =>
				<form className={style['form']} onSubmit={handleSubmit}>
					{this.renderCharacters()}
					{this.renderCommands()}
				</form>
			} />
		</Page>
	}

	private renderCharacters() {
		const { statusList } = this.props;

		return <SelectableList className={style['characters']} field="selection" items={statusList} render={status => {
			const uuid = status.context.character.uuid;

			return {
				key: uuid,
				content: <div className={style['character']}>
					<div className={style['name']}>{status.get("name")}</div>
					<VisibilityToggle className={style['visibility']} uuid={uuid} on="表示" off="非表示" />
				</div>
			};
		}} />
	}

	private renderCommands() {
		return <FormSpy subscription={{ values: true }} render={({ values: { selection } }) => {
			const some = (selection.length > 0);
			const single = (selection.length === 1);

			return <CommandList className={style['commands']} name="command" commands={[
				{ value: "delete", disabled: !some, children: "削除" },
				{ value: "clone", disabled: !some, children: "複製" },
				{ value: "edit", disabled: !single, children: "編集" },
				{ value: "import", disabled: false, children: "読込み" },
				{ value: "export", disabled: !some, children: "書出し" },
			]} />
		}} />
	}

	private handleSubmit(values: object, form: FormApi): void {
		const { command, selection } = values as FormValues;

		if (command && this.invokeCommand(command, selection)) {
			form.reset();
		}
	}

	private invokeCommand(type: CommandType, selection: string[]): boolean {
		switch (type) {
			case "delete": return this.deleteCommand(selection);
			case "clone": return this.cloneCommand(selection);
			case "edit": return this.editCommand(selection);
			case "import": return this.importCommand(selection);
			case "export": return this.exportCommand(selection);
		}
	}

	private deleteCommand(selection: string[]): boolean {
		const { dispatcher } = this.props;

		selection.forEach(uuid => dispatcher.character.delete(uuid));

		return true;
	}

	private cloneCommand(selection: string[]): boolean {
		const { provider, dispatcher } = this.props;

		const sources = provider.character.get(selection);
		for (const source of sources) {
			const character = source.set({ uuid: generateUUID() });
			dispatcher.character.create(character);
		}

		return true;
	}

	private editCommand(selection: string[]): boolean {
		const { history } = this.props;

		const target = selection[0];
		if (target !== undefined) {
			history.push(`/status/character-edit/${target}`);
		}

		return false;
	}

	private importCommand(selection: string[]): boolean {
		// TODO: implementation

		return true;
	}

	private exportCommand(selection: string[]): boolean {
		// TODO: implementation

		return false;
	}
}