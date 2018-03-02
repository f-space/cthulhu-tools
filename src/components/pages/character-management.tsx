import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { CharacterView, Character, DataProvider, ExternalCache, EvaluationContext, Status } from "models/status";
import CacheStorage from "models/idb-cache";
import { State } from "redux/store";
import { getDataProvider } from "redux/selectors/root";
import RootCommand from "redux/commands/root";
import { Button } from "components/atoms/button";
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

export interface CharacterManagementPageState {
	checked: { [uuid: string]: boolean };
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

const mapDispatchToProps = (dispatch: Dispatch<State>) => {
	const command = new RootCommand(dispatch);
	return { command };
};

type CMPProps = CharacterManagementPageProps;
type CMPState = CharacterManagementPageState;

export class CharacterManagementPage extends React.Component<CMPProps, CMPState> {

	public get some(): boolean { return Object.values(this.state.checked).some(x => x); }

	public get single(): boolean { return Object.values(this.state.checked).reduce((sum, x) => sum + (x ? 1 : 0), 0) === 1; }

	public get selection(): string[] { return Object.keys(this.state.checked).filter(uuid => this.state.checked[uuid]); }

	public constructor(props: CMPProps, context: any) {
		super(props, context);

		this.state = { checked: Object.create(null) };
		this.handleToggle = this.handleToggle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	public componentWillMount(): void {
		this.props.command.load();
	}

	public render() {
		const { characters } = this.props;

		return <Page id="character-management" heading={<h2>キャラクター管理</h2>} navs={
			<Link to="/status/character-edit"><Button>作成</Button></Link>
		}>
			<div className={style['characters']}>
				{characters.map(this.renderCharacter.bind(this))}
			</div>
			<div className={style['commands']}>
				{this.renderCommand("delete", this.some, "削除")}
				{this.renderCommand("clone", this.some, "複製")}
				{this.renderCommand("edit", this.single, "編集")}
				{this.renderCommand("import", true, "読込み")}
				{this.renderCommand("export", this.some, "書出し")}
			</div>
		</Page>
	}

	private renderCharacter(character: Status) {
		const uuid = character.$uuid;
		const { views } = this.props;
		const { checked } = this.state;

		return <SelectableItem key={uuid} className={style['character']} name={`checked@${uuid}`} checked={checked[uuid]} onToggle={this.handleToggle}>
			<div className={style['content']}>
				<div className={style['name']}>{character.name}</div>
				<Toggle className={style['visibility']} name={`visibility@${uuid}`} on="表示" off="非表示" checked={views[uuid].visible} onChange={this.handleChange} />
			</div>
		</SelectableItem>
	}

	private renderCommand(name: string, condition: boolean, children: React.ReactNode) {
		return <Button className={classNames(style['command'], { [style['hidden']]: !condition })} name={name} onClick={this.handleClick}>{children}</Button>
	}

	private handleToggle(name: string, value: boolean): void {
		const uuid = name.slice(name.indexOf("@") + 1);

		this.setState(({ checked: prev }) => {
			const change = { [uuid]: value || undefined };
			const checked = Object.assign(Object.create(null), prev, change);
			return { checked };
		});
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const uuid = name.slice(name.indexOf("@") + 1);
		const checked = target.checked;

		const { views, command } = this.props;
		const oldView = views[uuid];
		const newView = new CharacterView(Object.assign(oldView.toJSON(), { visible: checked }));
		command.view.update(newView);
	}

	private handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
		const target = event.currentTarget;
		const name = target.name;

		switch (name) {
			case "delete": this.deleteOp(); break;
			case "clone": this.cloneOp(); break;
			case "edit": this.editOp(); break;
			case "import": this.importOp(); break;
			case "export": this.exportOp(); break;
		}
	}

	private deleteOp(): void {
		const { command } = this.props;

		this.selection.forEach(uuid => command.character.delete(uuid));

		this.resetSelection();
	}

	private cloneOp(): void {
		const { provider, command } = this.props;

		const sources = provider.character.get(this.selection);
		for (const source of sources) {
			const character = new Character(Object.assign(source.toJSON(), { uuid: undefined }));
			command.character.create(character);
		}

		this.resetSelection();
	}

	private editOp(): void {
		const { history } = this.props;

		const target = this.selection[0];
		if (target !== undefined) {
			history.push(`/status/character-edit/${target}`);
		}
	}

	private importOp(): void {
		// TODO: implementation

		const { provider, command } = this.props;
		const profile = provider.profile.default;
		if (profile) {
			const character = new Character({ profile: profile.uuid, params: { attribute: { name: { x: "XXX" } } } });
			command.character.create(character);
		}
	}

	private exportOp(): void {
		// TODO: implementation
	}

	private resetSelection(): void {
		this.setState({ checked: Object.create(null) });
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(CharacterManagementPage);