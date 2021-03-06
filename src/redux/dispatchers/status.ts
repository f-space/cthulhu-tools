import CacheStorage from "models/idb-cache";
import { Dispatch } from "redux/store";
import { LoadError } from "redux/states/status";
import { StatusAction } from "redux/actions/status";
import ViewDispatcher from "redux/dispatchers/view";
import CharacterDispatcher from "redux/dispatchers/character";
import ProfileDispatcher from "redux/dispatchers/profile";
import AttributeDispatcher from "redux/dispatchers/attribute";
import SkillDispatcher from "redux/dispatchers/skill";
import ItemDispatcher from "redux/dispatchers/item";
import HistoryDispatcher from "redux/dispatchers/history";

export default class StatusDispatcher {
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
		this.dispatch(StatusAction.setLoadState('loading'));

		if (window.indexedDB) {
			const loadBuiltins = Promise.all([
				this.profile.loadBuiltins(),
				this.attribute.loadBuiltins(),
				this.skill.loadBuiltins(),
			]);
			const loadUserData = Promise.all([
				this.view.load(),
				this.character.load(),
				this.profile.load(),
				this.attribute.load(),
				this.skill.load(),
				this.item.load(),
				this.history.load(),
			]);
			const loadCache = CacheStorage.load();

			await Promise.all([
				loadBuiltins.catch(() => Promise.reject('network')),
				loadUserData.catch(() => Promise.reject('indexeddb')),
				loadCache.catch(() => Promise.reject('indexeddb')),
			]).then(() => {
				this.dispatch(StatusAction.setLoadState('loaded'));
			}).catch((e: LoadError) => {
				this.dispatch(StatusAction.setLoadState('error', e));
			});
		} else {
			this.dispatch(StatusAction.setLoadState('error', 'indexeddb'));
		}
	}
}