import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { Skill, PropertyEvaluator, SkillEvaluator } from 'models/status';
import { deepClone } from 'models/utility';

type InputType = {
	id: string;
	point: number;
}

@Component
export default class SkillInput extends Vue {
	@Prop({ required: true })
	public readonly skills: Skill[];

	@Prop({ required: true })
	public readonly evaluator: PropertyEvaluator;

	@Prop({ required: true })
	public readonly value: InputType;

	public id: string = this.value.id;
	public point: number = this.value.point;

	public get min(): number { return 0; }
	public get max(): number { return 99 - (this.base || 0); }

	public get base(): number | undefined {
		return this.evaluator.replace(evaluator => {
			if (evaluator instanceof SkillEvaluator) {
				const { resolver, min, max } = evaluator;
				const data = Object.assign(deepClone(evaluator.data), { [this.id]: 0 });
				return new SkillEvaluator(resolver, data, min, max);
			}
			return null;
		}).evaluate(this.id, null);
	}

	public get sum(): number | undefined { return this.evaluator.evaluate(this.id, null); }

	@Watch("id")
	@Watch("point")
	protected onValueChanged(): void {
		this.$emit('input', { id: this.id, point: this.point });
	}
}