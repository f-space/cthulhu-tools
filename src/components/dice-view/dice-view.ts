import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ResizeEvent, { mixin } from "mixins/resize-event";
import DiceRoll from "@component/dice-roll";
import DiceRowLayout from "@component/dice-row-layout";
import DiceCircleLayout from "@component/dice-circle-layout";
import DiceFlowLayout from "@component/dice-flow-layout";
import DiceImage from "@component/dice-image";
import DiceNumberDisplay from "@component/dice-number-display";

@Component({
	components: {
		DiceImage,
		DiceNumberDisplay,
	}
})
export default class DiceView extends mixin(DiceRoll, ResizeEvent) {
	private width: number = 0;
	private height: number = 0;

	public get layout(): typeof Vue {
		if (!this.uniform || this.diceCount <= 3) return DiceFlowLayout;
		if (this.groupCount >= 5 && this.groupCount <= 10 && this.groupLength === 1) return DiceCircleLayout;
		return DiceRowLayout;
	}

	public get uniform(): boolean { return this.diceTypes.every(dice => dice.length === this.diceTypes[0].length); }

	public get diceCount(): number { return this.diceTypes.reduce((sum, group) => sum += group.length, 0); }

	public get groupCount(): number { return this.diceTypes.length; }

	public get groupLength(): number { return this.diceTypes.length !== 0 ? this.diceTypes[0].length : 0; }

	public get is1D100(): boolean { return this.diceSet.size === 1 && this.diceSet.dices[0].max === 100; }

	protected mounted(): void { this.updateSize(); }

	protected resized(): void { this.updateSize(); }

	private updateSize(): void {
		this.$nextTick(function () {
			const view = this.$el as Element;
			this.width = view.clientWidth;
			this.height = view.clientHeight;
		});
	}
}