import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { NumberInputMethod } from 'models/status';

@Component
export default class AttributeNumberInput extends Vue {
	@Prop({ required: true })
	public readonly method!: NumberInputMethod;

	@Prop()
	public readonly value?: number;

	public get min(): number | undefined { return this.method.min; }
	public get max(): number | undefined { return this.method.max; }
	public get step(): number | undefined { return this.method.step; }

	protected onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		this.$emit('input', input.value);
	}
}