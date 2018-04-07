import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormApi } from 'final-form';
import { Form, Field, FormSpy } from 'react-final-form';
import { CharacterView, Character, DataProvider, ExternalCache, EvaluationContext, Status } from "models/status";
import CacheStorage from "models/idb-cache";
import { State, Dispatch } from "redux/store";
import { LoadState } from "redux/states/status";
import { getLoadState, getDataProvider } from "redux/selectors/status";
import StatusDispatcher from "redux/dispatchers/status";
import { SubmitButton, ButtonProps } from "components/atoms/button";
import VisibilityToggle from "components/organisms/visibility-toggle";
import Page from "components/templates/page";
import SelectableItem from "components/molecules/selectable-item";
import style from "styles/pages/character-management.scss";

export interface CharacterManagementPageProps extends RouteComponentProps<{}> {
	loadState: LoadState;
	provider: DataProvider;
	views: { [uuid: string]: CharacterView };
	characters: Status[];
	dispatcher: StatusDispatcher;
}

type CommandType = "delete" | "clone" | "edit" | "import" | "export";

interface FormValues {
	command?: CommandType;
	selection: string[];
}

const mapStateToProps = (state: State) => {
	const loadState = getLoadState(state);
	const provider = getDataProvider(state);
	const views = state.status.view.views.toObject();
	const characters = Object.values(views)
		.map(view => new EvaluationContext({ character: view.target }, provider))
		.filter(context => context.guard())
		.map(context => new Status(context as EvaluationContext))
		.map(status => new Status(status.$context, new ExternalCache(CacheStorage, status.$hash)))
		.sort((x, y) => String.prototype.localeCompare.call(x.name || "", y.name || ""))
	return { loadState, provider, views, characters };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	const dispatcher = new StatusDispatcher(dispatch);
	return { dispatcher };
};

export class CharacterManagementPage extends React.Component<CharacterManagementPageProps> {
	public constructor(props: CharacterManagementPageProps, context: any) {
		super(props, context);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	public componentWillMount(): void {
		if (this.props.loadState === 'unloaded') {
			this.props.dispatcher.load();
		}
	}

	public render() {
		if (this.props.loadState !== 'loaded') return null;

		const { views } = this.props;
		const initialValues = { selection: [] };

		return <Page id="character-management" heading={<h2>キャラクター管理</h2>} navs={
			<Link to="/status/character-edit">作成</Link>
		}>
			<Form initialValues={initialValues} onSubmit={this.handleSubmit} render={({ handleSubmit }) =>
				<form className={style['form']} onSubmit={handleSubmit}>
					{this.renderCharacters()}
					{this.renderCommands()}
				</form>
			} />
		</Page>
	}

	private renderCharacters() {
		const { views, characters } = this.props;

		return <div className={style['characters']}>
			{
				characters.map(character => {
					const uuid = character.$uuid;
					const { visible } = views[uuid];

					return <SelectableItem key={uuid} className={style['character']} checkbox={{ field: "selection", value: uuid }}>
						<div className={style['content']}>
							<div className={style['name']}>{character.name}</div>
							<VisibilityToggle className={style['visibility']} uuid={uuid} on="表示" off="非表示" />
						</div>
					</SelectableItem>
				})
			}
		</div>
	}

	private renderCommands() {
		return <FormSpy subscription={{ values: true }} render={({ values: { selection } }) => {
			const some = (selection.length > 0);
			const single = (selection.length === 1);

			return <div className={style['commands']}>
				<Field name="command" render={({ input: { onChange } }) => {
					function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
						onChange(event.currentTarget.value);
					}

					return <React.Fragment>
						<SubmitButton className={style['command']} value="delete" disabled={!some} commit={false} onClick={handleClick} >削除</SubmitButton>
						<SubmitButton className={style['command']} value="clone" disabled={!some} commit={false} onClick={handleClick}>複製</SubmitButton>
						<SubmitButton className={style['command']} value="edit" disabled={!single} commit={false} onClick={handleClick}>編集</SubmitButton>
						<SubmitButton className={style['command']} value="import" disabled={false} commit={false} onClick={handleClick}>読込み</SubmitButton>
						<SubmitButton className={style['command']} value="export" disabled={!some} commit={false} onClick={handleClick}>書出し</SubmitButton>
					</React.Fragment>
				}} />
			</div>
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
			const character = new Character(Object.assign(source.toJSON(), { uuid: undefined }));
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

		const { provider, dispatcher } = this.props;
		const profile = provider.profile.default;
		if (profile) {
			const character = new Character({ profile: profile.uuid, params: { attribute: { name: { x: "XXX" } } } });
			dispatcher.character.create(character);
		}

		return true;
	}

	private exportCommand(selection: string[]): boolean {
		// TODO: implementation

		return false;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterManagementPage);