import CacheStorage from "models/idb-cache";
import { Dispatch } from "redux/store";
import ViewDispatcher from "redux/dispatchers/view";
import CharacterDispatcher from "redux/dispatchers/character";
import ProfileDispatcher from "redux/dispatchers/profile";
import AttributeDispatcher from "redux/dispatchers/attribute";
import SkillDispatcher from "redux/dispatchers/skill";
import ItemDispatcher from "redux/dispatchers/item";
import HistoryDispatcher from "redux/dispatchers/history";

export default class RootDispatcher {
	public readonly view: ViewDispatcher;
	public readonly character: CharacterDispatcher;
	public readonly profile: ProfileDispatcher;
	public readonly attribute: AttributeDispatcher;
	public readonly skill: SkillDispatcher;
	public readonly item: ItemDispatcher;
	public readonly history: HistoryDispatcher;

	public constructor(readonly dispatch: Dispatch) {
		this.view = new ViewDispatcher(dispatch);
		this.character = new CharacterDispatcher(dispatch);
		this.profile = new ProfileDispatcher(dispatch);
		this.attribute = new AttributeDispatcher(dispatch);
		this.skill = new SkillDispatcher(dispatch);
		this.item = new ItemDispatcher(dispatch);
		this.history = new HistoryDispatcher(dispatch);
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