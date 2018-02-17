import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { TextInputMethod } from 'models/status';

@Component
export default class AttributeNumberInput extends Vue {
	@Prop({ required: true })
	public readonly method!: TextInputMethod;

	@Prop()
	public readonly value?: string;

	protected onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		this.$emit('input', input.value);
	}
}