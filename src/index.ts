import store from "modules/store";
import AppComponent from "components/app/app.vue";

document.addEventListener("DOMContentLoaded", () => {
	const vm = new AppComponent({ store: store });

	vm.$mount("#app");
});