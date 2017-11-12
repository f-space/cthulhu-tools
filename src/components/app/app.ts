import Vue from 'vue';
import { createNamespacedHelpers } from "vuex";
import { Page, State } from "modules/page";
import HomeComponent from "components/home/home.vue";
import DiceComponent from "components/dice/dice.vue";
import StatusComponent from "components/status/status.vue";
import CharacterManagementComponent from "components/character-management/character-management.vue";
import CharacterEditComponent from "components/character-edit/character-edit.vue";

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
	computed: {
		...mapState<State>({
			page(state) { return PAGE_MAP[state.page]; }
		}),
	},
	methods: {
		...mapMutations(["toHome", "toDice", "toStatus"]),
	},
	components: {
		[PAGE_MAP[Page.Home]]: HomeComponent,
		[PAGE_MAP[Page.Dice]]: DiceComponent,
		[PAGE_MAP[Page.Status]]: StatusComponent,
		[PAGE_MAP[Page.CharacterManagement]]: CharacterManagementComponent,
		[PAGE_MAP[Page.CharacterEdit]]: CharacterEditComponent,
	}
});