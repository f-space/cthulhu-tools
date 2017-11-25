import store from "modules/store";
import AppComponent from "@component/app";

if (document.readyState !== 'loading') {
	initialize();
} else {
	document.addEventListener("DOMContentLoaded", initialize);
}

function initialize() {
	const vm = new AppComponent({ store: store });

	vm.$mount("#app");
}