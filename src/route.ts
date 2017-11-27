import { RouterOptions } from 'vue-router';
import HomePage from "@component/home";
import DicePage from "@component/dice";
import StatusPage from "@component/status";
import CharacterManagementPage from "@component/character-management";
import CharacterEditPage from "@component/character-edit";

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
			component: CharacterManagementPage,
		},
		{
			path: "/status/character-edit",
			component: CharacterEditPage,
		},
	],
	linkActiveClass: "",
	linkExactActiveClass: "active",
} as RouterOptions;