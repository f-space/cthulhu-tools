import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import mixin from "mixins/mixin";
import { DialogHost } from "mixins/dialog";
import PageHeader from "@component/frame/header";
import PageNavigation from "@component/frame/navigation";

@Component({
	components: {
		PageHeader,
		PageNavigation,
	}
})
export default class CthulhuApp extends mixin(Vue, DialogHost) {
	@Watch("$route")
	protected onRouteChanged(): void {
		this.$dialog.cancel();
	}
}