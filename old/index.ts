import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import RootModule from "modules/root";
import AppComponent from "@component/frame/app";
import routes from "route";

Vue.use(VueRouter);
Vue.use(Vuex);

const router = new VueRouter(routes);
const store = new Vuex.Store(RootModule as any)
const app = new AppComponent({ router, store });

store.dispatch("status/load").then(() => {
	if (document.readyState !== 'loading') {
		mount();
	} else {
		document.addEventListener("DOMContentLoaded", mount);
	}
});

function mount() {
	app.$mount("#app");;
}