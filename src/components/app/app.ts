import Vue from 'vue';
import { createNamespacedHelpers } from "vuex";
import { Page, State } from "modules/page";
import ResourceComponent from "@component/resource";
import HomeComponent from "@component/home";
import DiceComponent from "@component/dice";
import StatusComponent from "@component/status";
import CharacterManagementComponent from "@component/character-management";
import CharacterEditComponent from "@component/character-edit";

const { mapState, mapMutations } = createNamespacedHelpers("page");

const PAGE_MAP = {
	[Page.Home]: "home-component",
	[Page.Dice]: "dice-component",
	[Page.Status]: "status-component",
	[Page.CharacterManagement]: "character-management-component",
	[Page.CharacterEdit]: "character-edit-component",
}

export default Vue.extend({
	name: "app-component",
	provide(this: any) { return { app: this } },
	computed: {
		resources(): any { return this.$refs.resources; },
		...mapState<State>({
			page(state) { return PAGE_MAP[state.page]; },
			inHome(state) { return state.page === Page.Home; },
			inDice(state) { return state.page === Page.Dice; },
			inStatus(state) { return state.page === Page.Status; },
			inCharacterManagement(state) { return state.page === Page.CharacterManagement; },
			inCharacterEdit(state) { return state.page === Page.CharacterEdit; },
		}),
	},
	methods: {
		...mapMutations(["toHome", "toDice", "toStatus"]),
	},
	components: {
		ResourceComponent,
		[PAGE_MAP[Page.Home]]: HomeComponent,
		[PAGE_MAP[Page.Dice]]: DiceComponent,
		[PAGE_MAP[Page.Status]]: StatusComponent,
		[PAGE_MAP[Page.CharacterManagement]]: CharacterManagementComponent,
		[PAGE_MAP[Page.CharacterEdit]]: CharacterEditComponent,
	}
});