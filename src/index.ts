import store from "modules/store";
import AppComponent from "@component/app";

document.addEventListener("DOMContentLoaded", () => {
	const vm = new AppComponent({ store: store });

	vm.$mount("#app");
});