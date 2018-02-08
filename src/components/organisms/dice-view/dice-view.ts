import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { DiceDisplay } from 'models/dice';
import DiceImage from "@component/atoms/dice-image";
import DiceNumberDisplay from "@component/atoms/dice-number-display";
import DiceLayout from "@component/molecules/dice-layout";
import DiceRoll from "@component/organisms/dice-roll";

@Component({
	components: {
		DiceImage,
		DiceNumberDisplay,
		DiceLayout,
	}
})
export default class DiceView extends DiceRoll {
	public get layout(): 'flow' | 'circle' | 'row' {
		const count = this.dices.length;
		const uniform = count > 0 && this.dices.every(dice => dice.type === this.dices[0].type);
		const perGroup = uniform ? this.display[0].length : 0;

		if (!uniform || count <= 3) return 'flow';
		if (count >= 5 && count <= 10 && perGroup === 1) return 'circle';
		return 'row';
	}

	public get display(): DiceDisplay[][] { return this.dices.map((dice, index) => dice.display(this.faces[index])); }

	public get value(): number { return this.dices.reduce((sum, dice, index) => sum + dice.value(this.faces[index]), 0); }

	public get max(): number { return this.dices.reduce((sum, dice) => sum + dice.value(dice.max), 0); }
	public get digits(): number { return this.max > 0 ? Math.floor(Math.log10(this.max) + 1) : 0; }

	public get is1D100(): boolean { return this.dices.length === 1 && this.dices[0].type === 'D100' && this.dices[0].faces === 100; }
	public get critical(): boolean { return this.is1D100 && this.value > 95; }
	public get fumble(): boolean { return this.is1D100 && this.value <= 5; }
}