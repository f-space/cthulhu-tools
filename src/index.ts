import Vue from 'vue';
import VueRouter from 'vue-router';
import AppComponent from "@component/app";
import routes from "./route";

Vue.use(VueRouter);

const router = new VueRouter(routes);
const app = new AppComponent({ router });

if (document.readyState !== 'loading') {
	mount();
} else {
	document.addEventListener("DOMContentLoaded", mount);
}

function mount() {
	app.$mount("#app");;
}