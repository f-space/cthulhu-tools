import Vue from 'vue';
import { Component, Watch } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import mixin from "mixins/mixin";
import { DialogHost } from "mixins/dialog";
import PageHeader from "@component/frame/header";
import PageNavigation from "@component/frame/navigation";

const ResourceAction = namespace("resource", Action);

@Component({
	components: {
		PageHeader,
		PageNavigation,
	}
})
export default class CthulhuApp extends mixin(Vue, DialogHost) {
	@ResourceAction("updateDiceImage")
	public setDiceImage: (payload: [HTMLImageElement]) => void;

	@ResourceAction("updateDiceSound")
	public setDiceSound: (payload: [HTMLAudioElement]) => void;

	public mounted(): void {
		const image = this.$refs.diceImage as HTMLImageElement;
		const sound = this.$refs.diceSound as HTMLAudioElement;

		this.setDiceImage([image]);
		this.setDiceSound([sound]);
	}

	@Watch("$route")
	protected onRouteChanged(): void {
		this.$dialog.cancel();
	}
}