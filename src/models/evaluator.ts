import { Reference, Expression, Format } from "models/expression";
import { CharacterParams, AttributeParams, SkillParams } from "models/character";
import { Attribute, IntegerAttribute, NumberAttribute, TextAttribute } from "models/attribute";
import { Skill } from "models/skill";
import { History } from "models/history";
import { AttributeProperty, SkillProperty } from "models/property";
import { EvaluationContext, PropertyEvaluator } from "models/evaluation";

export interface TerminalEvaluator extends PropertyEvaluator {
	supports(context: EvaluationContext): boolean;
}

export class AttributeEvaluator implements TerminalEvaluator {
	public constructor(readonly data: AttributeParams) { }

	public supports(context: EvaluationContext): boolean {
		return ('attribute' in context.property);
	}

	public evaluate(context: EvaluationContext): any {
		const { property } = context;
		if (this.supports(context)) {
			const { attribute } = property as AttributeProperty;
			switch (attribute.type) {
				case 'integer': return this.evaluateInteger(context, attribute);
				case 'number': return this.evaluateNumber(context, attribute);
				case 'text': return this.evaluateText(context, attribute);
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
			case 'attribute': return this.evaluateExpression(context, attribute, attribute.format);
			default: return undefined;
		}
	}

	private evaluateExpression(context: EvaluationContext, attribute: Attribute, expression: Expression | Format): any {
		const { chain, hash } = context;
		const data = this.data[attribute.id] || Object.create(null);
		const values = new Map<string, any>();

		for (const ref of expression.refs) {
			const value = chain.evaluate(ref, hash);
			values.set(ref.key, value);
		}

		for (const input of expression.inputs) {
			const method = attribute.inputs.find(x => x.name === input.name);
			if (method) {
				const value = method.evaluate(data[method.name]);
				values.set(input.key, value);
			}
		}

		return expression.evaluate(values);
	}
}

export class SkillEvaluator implements TerminalEvaluator {
	public constructor(readonly data: SkillParams) { }

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
		const { chain, ref, hash } = context;
		const base = chain.evaluate(new Reference(ref.id, 'base'), hash);
		const points = chain.evaluate(new Reference(ref.id, 'points'), hash);
		return (base !== undefined && points !== undefined) ? (base + points) : undefined;
	}

	private evaluateBase(context: EvaluationContext, skill: Skill): number | undefined {
		const { chain, hash } = context;
		const expression = skill.base;
		const values = new Map<string, any>();

		for (const ref of expression.refs) {
			const value = chain.evaluate(ref, hash);
			values.set(ref.key, value);
		}

		return skill.base.evaluate(values);
	}

	private evaluatePoints(context: EvaluationContext, skill: Skill): number | undefined {
		const points = this.data[skill.id];
		return points !== undefined ? points : 0;
	}
}

export class HistoryEvaluator implements TerminalEvaluator {
	public constructor(readonly history: History) { }

	public supports(context: EvaluationContext): boolean {
		return context.hash !== null && !context.property.view;
	}

	public evaluate(context: EvaluationContext): any {
		const { chain, ref, property, hash } = context;
		if (this.supports(context) && hash! in this.history.commands) {
			const command = this.history.commands[hash!];
			const prevValue = chain.evaluate(ref, command.parent);
			if (prevValue !== undefined) {
				return command.operations
					.filter(x => x.target === ref.key)
					.reduce((value, op) => op.apply(value), prevValue);
			}
		}

		return undefined;
	}
}

export class CompositeEvaluator implements PropertyEvaluator {
	public constructor(readonly evaluators: ReadonlyArray<TerminalEvaluator>) { }

	public evaluate(context: EvaluationContext): any {
		const evaluator = this.evaluators.find(evaluator => evaluator.supports(context));

		return evaluator && evaluator.evaluate(context);
	}
}

export class VoidEvaluator implements PropertyEvaluator {
	public evaluate(): undefined { return undefined; }
}

export interface EvaluatorConfig {
	readonly params?: Partial<CharacterParams>;
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