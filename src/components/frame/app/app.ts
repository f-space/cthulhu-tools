import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { DialogHost } from "vue-models/dialog";
import PageHeader from "@component/frame/header";
import PageNavigation from "@component/frame/navigation";

@Component({
	components: {
		PageHeader,
		PageNavigation,
	}
})
export default class CthulhuApp extends Vue.mixes(DialogHost) {
	@Watch("$route")
	protected onRouteChanged(): void {
		this.$dialog.cancel();
	}
}