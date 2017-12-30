import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Action, namespace } from 'vuex-class';
import PageHeader from "@component/header";
import PageNavigation from "@component/navigation";

const ResourceAction = namespace("resource", Action);

@Component({
	components: {
		PageHeader,
		PageNavigation,
	}
})
export default class CthulhuApp extends Vue {
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
}