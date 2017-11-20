import Vue from 'vue';
import DiceLayout from "components/dice-layout/dice-layout";

export default DiceLayout.extend({
	name: "dice-flow-layout",
	computed: {
		diceCount(): number { return this.dices.reduce((sum, group) => sum += group.length, 0); },
		displaySize(): number { return Math.floor(Math.sqrt((this.width * this.height) / this.diceCount * 0.75)); },
		style(): object { return { "--dice-size": `${this.displaySize}px` }; },
	},
});