import Vue from 'vue';
import HomeComponent from "components/home/home.vue";
import DiceComponent from "components/dice/dice.vue";
import StatusComponent from "components/status/status.vue";
import CharacterManagementComponent from "components/character-management/character-management.vue";
import CharacterEditComponent from "components/character-edit/character-edit.vue";

enum PageComponent {
	Home = "home-component",
	Dice = "dice-component",
	Status = "status-component",
	CharacterManagement = "character-management-component",
	CharacterEdit = "character-edit-component",
}

export default Vue.extend({
	name: "app-component",
	data() {
		return {
			page: PageComponent.Home,
		};
	},
	methods: {
		home() { this.page = PageComponent.Home; },
		dice() { this.page = PageComponent.Dice; },
		status() { this.page = PageComponent.Status; },
		characterManagement() { this.page = PageComponent.CharacterManagement; },
		characterEdit() { this.page = PageComponent.CharacterEdit; },
	},
	components: {
		[PageComponent.Home]: HomeComponent,
		[PageComponent.Dice]: DiceComponent,
		[PageComponent.Status]: StatusComponent,
		[PageComponent.CharacterManagement]: CharacterManagementComponent,
		[PageComponent.CharacterEdit]: CharacterEditComponent,
	}
});