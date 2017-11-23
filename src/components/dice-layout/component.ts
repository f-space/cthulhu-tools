import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

type DiceInfo = { type: string, face: number };

@Component
export default class DiceLayout extends Vue {
	@Prop({
		required: true,
		validator(value: number) { return Number.isFinite(value) && value >= 0; },
	})
	public width: number;

	@Prop({
		required: true,
		validator(value: number) { return Number.isFinite(value) && value >= 0; },
	})
	public height: number;

	@Prop({ required: true })
	public groupCount: number;

	@Prop({ required: true })
	public groupLength: number;

	@Prop({ required: true })
	public dices: DiceInfo[][];
}