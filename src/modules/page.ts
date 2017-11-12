import { createModule } from "modules/helper";

export enum Page {
	Home = "home",
	Dice = "dice",
	Status = "status",
	CharacterManagement = "character-management",
	CharacterEdit = "character-edit",
}

export interface State {
	page: Page;
}

export interface Mutations {
	toHome: void;
	toDice: void;
	toStatus: void;
	toCharacterManagement: void;
	toCharacterEdit: void;
}

export default createModule<any, State, {}, Mutations>({
	namespaced: true,
	state: {
		page: Page.Home,
	},
	mutations: {
		toHome(state) { state.page = Page.Home; },
		toDice(state) { state.page = Page.Dice; },
		toStatus(state) { state.page = Page.Status; },
		toCharacterManagement(state) { state.page = Page.CharacterManagement; },
		toCharacterEdit(state) { state.page = Page.CharacterEdit; },
	}
});