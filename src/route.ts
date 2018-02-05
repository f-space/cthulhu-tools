import { Route, RouterOptions } from 'vue-router';
import HomePage from "@component/pages/home";
import DicePage from "@component/pages/dice";
import StatusPage from "@component/pages/status";
import CharacterManagementPage from "@component/pages/character-management";
import CharacterManagementNav from "@component/pages/character-management-nav";
import CharacterEditPage from "@component/pages/character-edit";
import CharacterEditNav from "@component/pages/character-edit-nav";

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
			props: { default: (route: Route) => ({ uuid: route.query.uuid }) }
		},
	],
	linkActiveClass: "",
	linkExactActiveClass: "active",
} as RouterOptions;