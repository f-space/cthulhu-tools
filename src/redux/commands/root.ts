import CacheStorage from "models/idb-cache";
import { Store } from "redux/reducers/root";
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

	public constructor(readonly store: Store) {
		this.view = new ViewCommand(store);
		this.character = new CharacterCommand(store);
		this.profile = new ProfileCommand(store);
		this.attribute = new AttributeCommand(store);
		this.skill = new SkillCommand(store);
		this.item = new ItemCommand(store);
		this.history = new HistoryCommand(store);
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