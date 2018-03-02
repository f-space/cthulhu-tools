import CacheStorage from "models/idb-cache";
import { Dispatch } from "redux/store";
import ViewCommand from "redux/commands/view";
import CharacterCommand from "redux/commands/character";
import ProfileCommand from "redux/commands/profile";
import AttributeCommand from "redux/commands/attribute";
import SkillCommand from "redux/commands/skill";
import ItemCommand from "redux/commands/item";
import HistoryCommand from "redux/commands/history";

export default class RootCommand {
	public readonly view: ViewCommand;
	public readonly character: CharacterCommand;
	public readonly profile: ProfileCommand;
	public readonly attribute: AttributeCommand;
	public readonly skill: SkillCommand;
	public readonly item: ItemCommand;
	public readonly history: HistoryCommand;

	public constructor(readonly dispatch: Dispatch) {
		this.view = new ViewCommand(dispatch);
		this.character = new CharacterCommand(dispatch);
		this.profile = new ProfileCommand(dispatch);
		this.attribute = new AttributeCommand(dispatch);
		this.skill = new SkillCommand(dispatch);
		this.item = new ItemCommand(dispatch);
		this.history = new HistoryCommand(dispatch);
	}

	public async load(): Promise<void> {
		await Promise.all([
			this.view.load(),
			this.character.load(),
			this.profile.load(),
			this.attribute.load(),
			this.skill.load(),
			this.item.load(),
			this.history.load(),
			CacheStorage.load(),
		]);
	}
}