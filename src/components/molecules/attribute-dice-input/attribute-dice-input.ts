import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { DiceSet } from 'models/dice';
import { DiceInputMethod } from 'models/status';
import DiceImage from "@component/atoms/dice-image";

@Component({
	components: {
		DiceImage,
	}
})
export default class AttributeDiceInput extends Vue {
	@Prop({ required: true })
	public readonly method: DiceInputMethod;

	@Prop()
	public readonly value?: number[];

	public get diceSet(): DiceSet { return DiceSet.create(this.method.count, this.method.max); }

	public get dices(): { type: string, face: number }[] {
		const value = this.method.validate(this.value) ? this.value : this.method.default;
		return this.diceSet.dices.map((dice, index) => ({
			type: `D${dice.max}`,
			face: value[index] - 1,
		}));
	}

	protected openInputDialog(): void {
		// TODO: replace mock
		this.$emit('input', this.diceSet.dices.map(dice => dice.roll(Math.random())));
	}
}