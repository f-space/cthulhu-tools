import {
	Hash, Reference, Expression,
	CharacterParams, AttributeParams, SkillParams,
	AttributeType, Attribute, IntegerAttribute, NumberAttribute, TextAttribute,
	Skill, History
} from "models/data";
import { Property, AttributeProperty, SkillProperty } from "./property";

export interface EvaluationContext {
	readonly ref: Reference;
	readonly hash: string | null;
	readonly property: Property;
	request(ref: Reference, hash: string | null): any;
}

export interface PropertyEvaluator {
	readonly hash: string;
	evaluate(context: EvaluationContext): any;
}

export interface TerminalEvaluator extends PropertyEvaluator {
	supports(context: EvaluationContext): boolean;
}

export class AttributeEvaluator implements TerminalEvaluator {
	public constructor(readonly data: AttributeParams) { }

	public get hash(): string {
		return Hash.get(this, self => AttributeEvaluator.name + self.data.hash).hex;
	}

	public supports(context: EvaluationContext): boolean {
		return ('attribute' in context.property);
	}

	public evaluate(context: EvaluationContext): any {
		const { property } = context;
		if (this.supports(context)) {
			const { attribute } = property as AttributeProperty;
			switch (attribute.type) {
				case AttributeType.Integer: return this.evaluateInteger(context, attribute);
				case AttributeType.Number: return this.evaluateNumber(context, attribute);
				case AttributeType.Text: return this.evaluateText(context, attribute);
			}
		}
		return undefined;
	}

	private evaluateInteger(context: EvaluationContext, attribute: IntegerAttribute): number | undefined {
		const { property } = context;
		switch (property.type) {
			case 'attribute': return this.evaluateExpression(context, attribute, attribute.expression);
			case 'attribute:min': return attribute.min ? this.evaluateExpression(context, attribute, attribute.min) : Number.MIN_SAFE_INTEGER;
			case 'attribute:max': return attribute.max ? this.evaluateExpression(context, attribute, attribute.max) : Number.MAX_SAFE_INTEGER;
			default: return undefined;
		}
	}

	private evaluateNumber(context: EvaluationContext, attribute: NumberAttribute): number | undefined {
		const { property } = context;
		switch (property.type) {
			case 'attribute': return this.evaluateExpression(context, attribute, attribute.expression);
			case 'attribute:min': return attribute.min ? this.evaluateExpression(context, attribute, attribute.min) : Number.NEGATIVE_INFINITY;
			case 'attribute:max': return attribute.max ? this.evaluateExpression(context, attribute, attribute.max) : Number.POSITIVE_INFINITY;
			default: return undefined;
		}
	}

	private evaluateText(context: EvaluationContext, attribute: TextAttribute): string | undefined {
		const { property } = context;
		switch (property.type) {
			case 'attribute': return this.evaluateExpression(context, attribute, attribute.expression);
			default: return undefined;
		}
	}

	private evaluateExpression(context: EvaluationContext, attribute: Attribute, expression: Expression): any {
		const { hash, request } = context;
		const data = this.data.get(attribute.id) || new Map<string, any>();
		const values = new Map<string, any>();

		for (const reference of expression.refs) {
			const value = request(reference, hash);
			values.set(reference.key, value);
		}

		for (const variable of expression.vars) {
			const input = attribute.inputs.find(x => x.name === variable.name);
			if (input) {
				const value = input.evaluate(data.get(input.name));
				values.set(variable.key, value);
			}
		}

		return expression.evaluate(values);
	}
}

export class SkillEvaluator implements TerminalEvaluator {
	public constructor(readonly data: SkillParams) { }

	public get hash(): string {
		return Hash.get(this, self => SkillEvaluator.name + self.data.hash).hex;
	}

	public supports(context: EvaluationContext): boolean {
		return ('skill' in context.property);
	}

	public evaluate(context: EvaluationContext): any {
		const { property } = context;
		if (this.supports(context)) {
			const { skill } = property as SkillProperty;
			switch (property.type) {
				case 'skill': return this.evaluateSum(context);
				case 'skill:base': return this.evaluateBase(context, skill);
				case 'skill:points': return this.evaluatePoints(context, skill);
			}
		}
		return undefined;
	}

	private evaluateSum(context: EvaluationContext): number | undefined {
		const { ref, hash, request } = context;
		const base = request(ref.set({ modifier: 'base' }), hash);
		const points = request(ref.set({ modifier: 'points' }), hash);
		return (base !== undefined && points !== undefined) ? (base + points) : undefined;
	}

	private evaluateBase(context: EvaluationContext, skill: Skill): number | undefined {
		const { hash, request } = context;
		const expression = skill.base;
		const values = new Map<string, any>();

		for (const ref of expression.refs) {
			const value = request(ref, hash);
			values.set(ref.key, value);
		}

		return skill.base.evaluate(values);
	}

	private evaluatePoints(context: EvaluationContext, skill: Skill): number | undefined {
		const points = this.data.get(skill.id);
		return points !== undefined ? points : 0;
	}
}

export class HistoryEvaluator implements TerminalEvaluator {
	public constructor(readonly history: History) { }

	public get hash(): string {
		return Hash.get(this, () => HistoryEvaluator.name).hex;
	}

	public supports(context: EvaluationContext): boolean {
		return context.hash !== null && !context.property.view;
	}

	public evaluate(context: EvaluationContext): any {
		const { ref, hash, request } = context;
		if (this.supports(context)) {
			const command = this.history.commands.get(hash!);
			if (command !== undefined) {
				const prevValue = request(ref, command.parent);
				if (prevValue !== undefined) {
					return command.operations
						.filter(x => x.target === ref.key)
						.reduce((value, op) => op.apply(value), prevValue);
				}
			}
		}

		return undefined;
	}
}

export class CompositeEvaluator implements PropertyEvaluator {
	public get hash(): string {
		return Hash.get(this, self => CompositeEvaluator.name + self.evaluators.map(evaluator => evaluator.hash).join('')).hex;
	}

	public constructor(readonly evaluators: ReadonlyArray<TerminalEvaluator>) { }

	public evaluate(context: EvaluationContext): any {
		const evaluator = this.evaluators.find(evaluator => evaluator.supports(context));

		return evaluator && evaluator.evaluate(context);
	}
}

export class VoidEvaluator implements PropertyEvaluator {
	public get hash(): string { return Hash.get(this, () => VoidEvaluator.name).hex; }
	public evaluate(): undefined { return undefined; }
}

export interface EvaluatorConfig {
	readonly params?: CharacterParams;
	readonly history?: History | null;
}

export function buildEvaluator(config: EvaluatorConfig): PropertyEvaluator {
	const evaluators = [] as TerminalEvaluator[];

	if (config.history) evaluators.push(new HistoryEvaluator(config.history));

	if (config.params) {
		const { attribute, skill } = config.params;
		if (attribute) evaluators.push(new AttributeEvaluator(attribute));
		if (skill) evaluators.push(new SkillEvaluator(skill));
	}

	switch (evaluators.length) {
		case 0: return new VoidEvaluator();
		case 1: return evaluators[0];
		default: return new CompositeEvaluator(evaluators);
	}
}