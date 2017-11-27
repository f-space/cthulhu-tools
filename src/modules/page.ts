import { ModuleInterface, Module, Mutation } from "modules/vuex-class-module";

export enum Page {
	Home = "home",
	Dice = "dice",
	Status = "status",
	CharacterManagement = "character-management",
	CharacterEdit = "character-edit",
}

@Module({ namespaced: true })
export default class PageModule extends ModuleInterface {
	public page: Page = Page.Home;

	@Mutation public toHome(): void { this.page = Page.Home; }
	@Mutation public toDice(): void { this.page = Page.Dice; }
	@Mutation public toStatus(): void { this.page = Page.Status; }
	@Mutation public toCharacterManagement(): void { this.page = Page.CharacterManagement; }
	@Mutation public toCharacterEdit(): void { this.page = Page.CharacterEdit; }
}