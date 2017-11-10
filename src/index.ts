import AppComponent from "components/app/app.vue";

document.addEventListener("DOMContentLoaded", () => {
	const vm = new AppComponent();

	vm.$mount("#app");
});