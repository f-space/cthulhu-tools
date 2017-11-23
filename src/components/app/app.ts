import Vue from 'vue';
import { Component, Provide } from 'vue-property-decorator';
import { State, Mutation, namespace } from 'vuex-class';
import { Page } from "modules/page";
import ResourceComponent from "@component/resource";
import HomeComponent from "@component/home";
import DiceComponent from "@component/dice";
import StatusComponent from "@component/status";
import CharacterManagementComponent from "@component/character-management";
import CharacterEditComponent from "@component/character-edit";

const PageNamespace = "page";
const PageState = namespace(PageNamespace, State);
const PageMutation = namespace(PageNamespace, Mutation);

const PAGE_MAP = {
	[Page.Home]: "home-component",
	[Page.Dice]: "dice-component",
	[Page.Status]: "status-component",
	[Page.CharacterManagement]: "character-management-component",
	[Page.CharacterEdit]: "character-edit-component",
}

@Component({
	components: {
		ResourceComponent,
		[PAGE_MAP[Page.Home]]: HomeComponent,
		[PAGE_MAP[Page.Dice]]: DiceComponent,
		[PAGE_MAP[Page.Status]]: StatusComponent,
		[PAGE_MAP[Page.CharacterManagement]]: CharacterManagementComponent,
		[PAGE_MAP[Page.CharacterEdit]]: CharacterEditComponent,
	}
})
export default class CthulhuApp extends Vue {
	@Provide()
	public app: CthulhuApp = this;

	@PageState(state => PAGE_MAP[state.page as Page]) page: string;
	@PageState(state => state.page === Page.Home) inHome: boolean;
	@PageState(state => state.page === Page.Dice) inDice: boolean;
	@PageState(state => state.page === Page.Status) inStatus: boolean;
	@PageState(state => state.page === Page.CharacterManagement) inCharacterManagement: boolean;
	@PageState(state => state.page === Page.CharacterEdit) inCharacterEdit: boolean;

	public get resources(): ResourceComponent { return this.$refs.resources as ResourceComponent; }

	@PageMutation toHome: () => void;
	@PageMutation toDice: () => void;
	@PageMutation toStatus: () => void;
}