import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Attribute, InputMethod, InputParams, PropertyEvaluator } from "models/status";
import { substitute } from "models/eval";
import DiceInput from "@component/molecules/attribute-dice-input";
import NumberInput from "@component/molecules/attribute-number-input";
import TextInput from "@component/molecules/attribute-text-input";

@Component({ model: { prop: 'data' } })
export default class AttributeInput extends Vue {
	@Prop({ required: true })
	public readonly attribute: Attribute;

	@Prop({ required: true })
	public readonly evaluator: PropertyEvaluator;

	@Prop({ required: true, default: () => Object.create(null) })
	public readonly data: InputParams;

	public get segments(): (string | InputMethod)[] {
		const values = this.attribute.inputs.reduce((obj, { name }) => (obj[name] = `XXX___${name}___XXX`, obj), Object.create(null));
		const expression = substitute(this.attribute.expression, values);
		return expression.split("XXX").filter(x => x).map(segment => {
			const matches = segment.match(/^___(\w+)___$/);
			const input = matches !== null && this.attribute.inputs.find(input => input.name === matches[1]);
			return input || segment;
		});
	}

	public get value(): any { return this.evaluator.evaluate(this.attribute.id, null); }

	public get valid(): boolean { return this.attribute.inputs.every(input => input.validate(this.data[input.name])); }

	public component(input: InputMethod): typeof Vue {
		switch (input.type) {
			case 'dice': return DiceInput;
			case 'number': return NumberInput;
			case 'text': return TextInput;
		}
	}

	public onInput(name: string, value: any): void {
		this.$emit('input', Object.assign(Object.create(null), this.data, { [name]: value }));
	}
}