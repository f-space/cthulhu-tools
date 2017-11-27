import Vue from 'vue';
import Vuex from 'vuex';
import RootModule from "modules/root";
import AppComponent from "@component/app";

Vue.use(Vuex);

const store = new Vuex.Store(RootModule);
const app = new AppComponent({ store });

if (document.readyState !== 'loading') {
	mount();
} else {
	document.addEventListener("DOMContentLoaded", mount);
}

function mount() {
	app.$mount("#app");;
}