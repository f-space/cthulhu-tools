import Vue from 'vue';
import Vuex from 'vuex';
import { createStore } from "modules/helper";
import PageModule from "modules/page";

Vue.use(Vuex);

export interface Modules {
	page: typeof PageModule;
}

export type RootType = { S: {}, G: {}, MD: {} };

export default createStore<{}, {}, {}, {}, Modules>({
	modules: {
		page: PageModule
	}
});