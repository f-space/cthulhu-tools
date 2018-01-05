import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import DiceLayout from "@component/molecules/dice-layout";

@Component
export default class DiceFlowLayout extends DiceLayout {
	public get diceCount(): number {
		return this.dices.reduce((sum, group) => sum += group.length, 0);
	}

	public get displaySize(): number {
		return Math.floor(Math.sqrt((this.width * this.height) / this.diceCount * 0.75));
	}

	public get style(): object {
		return { "--dice-size": `${this.displaySize}px` };
	}
}