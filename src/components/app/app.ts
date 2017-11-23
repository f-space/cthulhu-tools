import Vue from 'vue';
import { Component, Provide } from 'vue-property-decorator';
import { State, Mutation, namespace } from 'vuex-class';
import { Page } from "modules/page";
import AppResource from "@component/resource";
import HomePage from "@component/home";
import DicePage from "@component/dice";
import StatusPage from "@component/status";
import CharacterManagementPage from "@component/character-management";
import CharacterEditPage from "@component/character-edit";

const PageNamespace = "page";
const PageState = namespace(PageNamespace, State);
const PageMutation = namespace(PageNamespace, Mutation);

const PAGE_MAP = {
	[Page.Home]: HomePage,
	[Page.Dice]: DicePage,
	[Page.Status]: StatusPage,
	[Page.CharacterManagement]: CharacterManagementPage,
	[Page.CharacterEdit]: CharacterEditPage,
}

@Component({
	components: {
		AppResource,
	}
})
export default class CthulhuApp extends Vue {
	@Provide()
	public app: CthulhuApp = this;

	@PageState(state => PAGE_MAP[state.page as Page]) page: typeof Vue;
	@PageState(state => state.page === Page.Home) inHome: boolean;
	@PageState(state => state.page === Page.Dice) inDice: boolean;
	@PageState(state => state.page === Page.Status) inStatus: boolean;
	@PageState(state => state.page === Page.CharacterManagement) inCharacterManagement: boolean;
	@PageState(state => state.page === Page.CharacterEdit) inCharacterEdit: boolean;

	public get resources(): AppResource { return this.$refs.resources as AppResource; }

	@PageMutation toHome: () => void;
	@PageMutation toDice: () => void;
	@PageMutation toStatus: () => void;
}