import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DiceDisplay } from "models/dice";
import ReactiveSize from "vue-models/reactive-size";

@Component
export default class DiceFlowLayout extends Vue.mixes(ReactiveSize) {
	@Prop({ required: true })
	public readonly display!: DiceDisplay[][];

	public get diceCount(): number { return this.display.reduce((sum, group) => sum + group.length, 0); }
	public get diceSize(): number { return Math.floor(Math.sqrt((this.width * this.height) / this.diceCount * 0.75)); }
}