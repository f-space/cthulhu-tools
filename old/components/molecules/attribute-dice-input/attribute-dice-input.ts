import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Dice, DiceDisplay } from 'models/dice';
import { DiceInputMethod } from 'models/status';
import DiceImage from "@component/atoms/dice-image";

@Component({
	components: {
		DiceImage,
	}
})
export default class AttributeDiceInput extends Vue {
	@Prop({ required: true })
	public readonly method!: DiceInputMethod;

	@Prop()
	public readonly value?: number[];

	public get dices(): DiceDisplay[][] {
		const faces = this.method.validate(this.value) ? this.value : this.method.default;

		return this.method.dices.map((dice, index) => dice.display(faces[index]));
	}

	protected openInputDialog(): void {
		// TODO: replace mock
		this.$emit('input', this.method.dices.map(dice => Math.floor(Math.random() * dice.faces)));
	}
}