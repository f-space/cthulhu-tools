import { DataProvider } from "models/status";
import CacheStorage from "models/idb-cache";
import { Module, Getter, Action, Child } from "modules/vuex-class-module";
import ViewModule from "modules/view";
import CharacterModule from "modules/character";
import ProfileModule from "modules/profile";
import AttributeModule from "modules/attribute";
import SkillModule from "modules/skill";
import ItemModule from "modules/item";
import HistoryModule from "modules/history";

const BUILTIN_PROFILES = "data/profiles.json";
const BUILTIN_ATTRIBUTES = "data/attributes.json";
const BUILTIN_SKILLS = "data/skills.json";

@Module({ namespaced: true })
export default class StatusModule {
	@Getter
	public get provider(): DataProvider {
		return {
			character: this.character.provider,
			profile: this.profile.provider,
			attribute: this.attribute.provider,
			skill: this.skill.provider,
			item: this.item.provider,
			history: this.history.provider,
		};
	}

	@Action
	public async load(): Promise<void> {
		await Promise.all([
			this.view.load(),
			this.character.load(),
			this.profile.loadBuiltins(BUILTIN_PROFILES).then(() => this.profile.load()),
			this.attribute.loadBuiltins(BUILTIN_ATTRIBUTES).then(() => this.attribute.load()),
			this.skill.loadBuiltins(BUILTIN_SKILLS).then(() => this.skill.load()),
			this.item.load(),
			this.history.load(),
			CacheStorage.load(),
		]);
	}

	@Child
	public view: ViewModule;

	@Child
	public character: CharacterModule;

	@Child
	public profile: ProfileModule;

	@Child
	public attribute: AttributeModule;

	@Child
	public skill: SkillModule;

	@Child
	public item: ItemModule;

	@Child
	public history: HistoryModule;
}