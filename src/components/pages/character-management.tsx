import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { CharacterView, Character, DataProvider, ExternalCache, EvaluationContext, Status } from "models/status";
import CacheStorage from "models/idb-cache";
import { State, Dispatch } from "redux/store";
import { getDataProvider } from "redux/selectors/root";
import RootCommand from "redux/commands/root";
import { Form, Field, Action, FormSpy, FieldChangeEvent, ActionEvent, FormChangeEvent } from "components/functions/form";
import { Button, ButtonProps } from "components/atoms/button";
import { Toggle } from "components/atoms/input";
import Page from "components/templates/page";
import SelectableItem from "components/molecules/selectable-item";
import style from "styles/pages/character-management.scss";

export interface CharacterManagementPageProps extends RouteComponentProps<{}> {
	provider: DataProvider;
	views: { [uuid: string]: CharacterView };
	characters: Status[];
	command: RootCommand;
}

type CommandType = "delete" | "clone" | "edit" | "import" | "export";

interface FormValues {
	[uuid: string]: boolean;
}

const BoolField = Field.type<boolean>();

function CommandButton(props: ButtonProps) {
	return <Button {...props} className={style['command']} />;
}

const mapStateToProps = (state: State) => {
	const provider = getDataProvider(state);
	const views = state.view.views.toObject();
	const characters = Object.values(views)
		.map(view => new EvaluationContext({ character: view.target }, provider))
		.filter(context => context.guard())
		.map(context => new Status(context as EvaluationContext))
		.map(status => new Status(status.$context, new ExternalCache(CacheStorage, status.$hash)))
		.sort((x, y) => String.prototype.localeCompare.call(x.name || "", y.name || ""))
	return { provider, views, characters };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	const command = new RootCommand(dispatch);
	return { command };
};

export class CharacterManagementPage extends React.Component<CharacterManagementPageProps> {
	public constructor(props: CharacterManagementPageProps, context: any) {
		super(props, context);

		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public componentWillMount(): void {
		this.props.command.load();
	}

	public render() {
		return <Page id="character-management" heading={<h2>キャラクター管理</h2>} navs={
			<Link to="/status/character-edit"><Button>作成</Button></Link>
		}>
			<Form initialValues={{}} render={props =>
				<form className={style['form']} {...props}>
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

					return <BoolField key={uuid} name={uuid} render={props =>
						<SelectableItem className={style['character']} checkbox={props}>
							<div className={style['content']}>
								<div className={style['name']}>{character.name}</div>
								<Toggle className={style['visibility']}
									name={uuid} value={visible} onChange={this.handleChange}
									on="表示" off="非表示" />
							</div>
						</SelectableItem>
					} />
				})
			}
		</div>
	}

	private renderCommands() {
		return <FormSpy dependency={{ values: true }} render={({ values }: { values: FormValues }) => {
			const selection = this.getSelection(values);
			const some = (selection.length > 0);
			const single = (selection.length === 1);

			return <div className={style['commands']}>
				<Action action={this.handleClick} render={({ action }) =>
					<React.Fragment>
						<CommandButton name="delete" disabled={!some} onClick={action} >削除</CommandButton>
						<CommandButton name="clone" disabled={!some} onClick={action}>複製</CommandButton>
						<CommandButton name="edit" disabled={!single} onClick={action}>編集</CommandButton>
						<CommandButton name="import" disabled={false} onClick={action}>読込み</CommandButton>
						<CommandButton name="export" disabled={!some} onClick={action}>書出し</CommandButton>
					</React.Fragment>
				} />
			</div>
		}} />
	}

	private handleChange({ name, value }: FieldChangeEvent<boolean>): void {
		const uuid = name;
		const visible = value;

		const { views, command } = this.props;
		const oldView = views[uuid];
		const newView = new CharacterView(Object.assign(oldView.toJSON(), { visible }));
		command.view.update(newView);
	}

	private handleClick({ name, values, command: { reset } }: ActionEvent<FormValues>): void {
		const type = name as CommandType;
		const selection = this.getSelection(values);

		if (this.invokeCommand(type, selection)) {
			reset();
		}
	}

	private getSelection(values: { [uuid: string]: any }): string[] {
		return Object.keys(values).filter(uuid => values[uuid]);
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
		const { command } = this.props;

		selection.forEach(uuid => command.character.delete(uuid));

		return true;
	}

	private cloneCommand(selection: string[]): boolean {
		const { provider, command } = this.props;

		const sources = provider.character.get(selection);
		for (const source of sources) {
			const character = new Character(Object.assign(source.toJSON(), { uuid: undefined }));
			command.character.create(character);
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

		const { provider, command } = this.props;
		const profile = provider.profile.default;
		if (profile) {
			const character = new Character({ profile: profile.uuid, params: { attribute: { name: { x: "XXX" } } } });
			command.character.create(character);
		}

		return true;
	}

	private exportCommand(selection: string[]): boolean {
		// TODO: implementation

		return false;
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterManagementPage);