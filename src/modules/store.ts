import Vue from 'vue';
import Vuex from 'vuex';
import { ModuleInterface, Store, SubModule } from "modules/vuex-class-module";
import PageModule from "modules/page";

Vue.use(Vuex);

@Store
export class RootModule extends ModuleInterface {
	@SubModule
	public page: PageModule;
}

export default new Vuex.Store(RootModule);