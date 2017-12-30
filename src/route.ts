import { RouterOptions } from 'vue-router';
import HomePage from "@component/home";
import DicePage from "@component/dice";
import StatusPage from "@component/status";
import CharacterManagementPage from "@component/character-management";
import CharacterManagementNav from "@component/character-management-nav";
import CharacterEditPage from "@component/character-edit";
import CharacterEditNav from "@component/character-edit-nav";

export default {
	routes: [
		{
			path: "/",
			component: HomePage,
		},
		{
			path: "/dice",
			component: DicePage,
		},
		{
			path: "/status",
			component: StatusPage,
		},
		{
			path: "/status/character-management",
			components: {
				default: CharacterManagementPage,
				navigation: CharacterManagementNav,
			},
		},
		{
			path: "/status/character-edit",
			components: {
				default: CharacterEditPage,
				navigation: CharacterEditNav,
			},
		},
	],
	linkActiveClass: "",
	linkExactActiveClass: "active",
} as RouterOptions;