import { Expression, Format } from "models/expression";
import { Character, AttributeParams, SkillParams } from "models/character";
import { Attribute, IntegerAttribute, NumberAttribute, TextAttribute } from "models/attribute";
import { Skill } from "models/skill";
import { History } from "models/history";
import { Property, AttributeProperty, SkillProperty } from "models/property";
import { PropertyResolver } from "models/resolver";
import { Cache, ObjectCache } from "models/cache";

export interface EvaluationContext {
	readonly property: Property;
	readonly hash: string | null;
	readonly resolver: PropertyResolver;
	readonly evaluator: PropertyEvaluator;
}

interface AttributeEvaluationContext extends EvaluationContext {
	readonly property: AttributeProperty;
}

interface SkillEvaluationContext extends EvaluationContext {
	readonly property: SkillProperty;
}

export interface PropertyEvaluator {
	supports(property: Property): boolean;
	evaluate(context: EvaluationContext): any;
	validate(context: EvaluationContext, value: any): any;
}

export class AttributeEvaluator implements PropertyEvaluator {
	public constructor(readonly data: AttributeParams) { }

	public supports(property: Property): boolean {
		return property.type === 'attribute';
	}

	public evaluate(context: EvaluationContext): any {
		return this.validate(context, this.evaluateInternal(context));
	}

	public validate(context: EvaluationContext, value: any): any {
		return value !== undefined ? this.validateInternal(context, value) : undefined;
	}

	private evaluateInternal(context: EvaluationContext): any {
		const { property } = context;
		if (property.type === 'attribute') {
			const ctx = context as AttributeEvaluationContext;
			const { attribute } = property;
			switch (attribute.type) {
				case 'integer': return this.evaluateInteger(ctx, attribute);
				case 'number': return this.evaluateNumber(ctx, attribute);
				case 'text': return this.evaluateText(ctx, attribute);
			}
		}
		return undefined;
	}

	private evaluateInteger(context: AttributeEvaluationContext, attribute: IntegerAttribute): number | undefined {
		switch (context.property.modifier) {
			case null: return this.evaluateExpression(context, attribute.expression);
			case 'min': return attribute.min ? this.evaluateExpression(context, attribute.min) : Number.MIN_SAFE_INTEGER;
			case 'max': return attribute.max ? this.evaluateExpression(context, attribute.max) : Number.MAX_SAFE_INTEGER;
			default: return undefined;
		}
	}

	private evaluateNumber(context: AttributeEvaluationContext, attribute: NumberAttribute): number | undefined {
		switch (context.property.modifier) {
			case null: return this.evaluateExpression(context, attribute.expression);
			case 'min': return attribute.min ? this.evaluateExpression(context, attribute.min) : Number.NEGATIVE_INFINITY;
			case 'max': return attribute.max ? this.evaluateExpression(context, attribute.max) : Number.POSITIVE_INFINITY;
			default: return undefined;
		}
	}

	private evaluateText(context: AttributeEvaluationContext, attribute: TextAttribute): string | undefined {
		switch (context.property.modifier) {
			case null: return this.evaluateExpression(context, attribute.format);
			default: return undefined;
		}
	}

	private evaluateExpression(context: AttributeEvaluationContext, expression: Expression | Format): any {
		const { property: { attribute }, resolver, evaluator } = context;
		const data = this.data[attribute.id] || Object.create(null);
		const values = new Map<string, any>();

		for (const ref of expression.refs) {
			const property = resolver.resolve(ref);
			if (property) {
				const value = evaluator.evaluate({ ...context, property });
				values.set(ref.key, value);
			}
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

	private validateInternal(context: EvaluationContext, value: any): any {
		const { property } = context;
		if (property.type === 'attribute') {
			const ctx = context as AttributeEvaluationContext;
			const { attribute } = property;
			switch (attribute.type) {
				case 'integer': return this.validateInteger(ctx, attribute, value);
				case 'number': return this.validateNumber(ctx, attribute, value);
				case 'text': return this.validateText(ctx, attribute, value);
			}
		}
		return undefined;
	}

	private validateInteger(context: AttributeEvaluationContext, attribute: IntegerAttribute, value: number): number | undefined {
		switch (context.property.modifier) {
			case null:
				const { property, evaluator } = context;
				const min = attribute.min && evaluator.evaluate({ ...context, property: AttributeProperty.min(attribute) });
				const max = attribute.max && evaluator.evaluate({ ...context, property: AttributeProperty.max(attribute) });
				if (max !== undefined) value = Math.min(value, max);
				if (min !== undefined) value = Math.max(value, min);
				return Math.round(value);
			case 'min': return Math.round(value);
			case 'max': return Math.round(value);
			default: return undefined;
		}
	}

	private validateNumber(context: AttributeEvaluationContext, attribute: NumberAttribute, value: number): number | undefined {
		switch (context.property.modifier) {
			case null:
				const { property, evaluator } = context;
				const min = attribute.min && evaluator.evaluate({ ...context, property: AttributeProperty.min(attribute) });
				const max = attribute.max && evaluator.evaluate({ ...context, property: AttributeProperty.max(attribute) });
				if (max !== undefined) value = Math.min(value, max);
				if (min !== undefined) value = Math.max(value, min);
				return Number(value);
			case 'min': return Number(value);
			case 'max': return Number(value);
			default: return undefined;
		}
	}

	private validateText(context: AttributeEvaluationContext, attribute: TextAttribute, value: string): string | undefined {
		switch (context.property.modifier) {
			case null: return String(value);
			default: return undefined;
		}
	}
}

export class SkillEvaluator implements PropertyEvaluator {
	public readonly min: number;
	public readonly max: number;

	public constructor(readonly data: SkillParams, min: number = 0, max: number = 99) {
		this.min = Number.isSafeInteger(min) ? min : Number.MIN_SAFE_INTEGER;
		this.max = Number.isSafeInteger(max) ? max : Number.MAX_SAFE_INTEGER;
	}

	public supports(property: Property): boolean {
		return property.type === 'skill';
	}

	public evaluate(context: EvaluationContext): any {
		return this.validate(context, this.evaluateInternal(context));
	}

	public validate(context: EvaluationContext, value: any): any {
		return value !== undefined ? this.validateInternal(context, value) : undefined;
	}

	private evaluateInternal(context: EvaluationContext): any {
		const { property } = context;
		if (property.type === 'skill') {
			const ctx = context as SkillEvaluationContext;
			switch (property.modifier) {
				case null: return this.evaluateSum(ctx);
				case 'base': return this.evaluateBase(ctx);
				case 'points': return this.evaluatePoints(ctx);
			}
		}
		return undefined;
	}

	private evaluateSum(context: SkillEvaluationContext): number | undefined {
		const { property: { skill }, evaluator } = context;
		const base = evaluator.evaluate({ ...context, property: SkillProperty.base(skill) });
		const points = evaluator.evaluate({ ...context, property: SkillProperty.points(skill) });
		return (base !== undefined && points !== undefined) ? (base + points) : undefined;
	}

	private evaluateBase(context: SkillEvaluationContext): number | undefined {
		const { property: { skill }, resolver, evaluator } = context;
		const expression = skill.base;
		const values = new Map<string, any>();

		for (const ref of expression.refs) {
			const property = resolver.resolve(ref);
			if (property) {
				const value = evaluator.evaluate({ ...context, property });
				values.set(ref.key, value);
			}
		}

		return skill.base.evaluate(values);
	}

	private evaluatePoints(context: SkillEvaluationContext): number | undefined {
		const { property: { skill } } = context;
		const points = this.data[skill.id];
		return points !== undefined ? points : 0;
	}

	private validateInternal(context: EvaluationContext, value: any): any {
		const { property } = context;
		if (property.type === 'skill') {
			return Math.round(Math.max(Math.min(value, this.max), this.min));
		}
		return undefined;
	}
}

export class CompoundEvaluator implements PropertyEvaluator {
	public constructor(readonly evaluators: ReadonlyArray<PropertyEvaluator>) { }

	public supports(property: Property): boolean {
		return this.evaluators.some(evaluator => evaluator.supports(property));
	}

	public evaluate(context: EvaluationContext): any {
		const evaluator = this.evaluators.find(evaluator => evaluator.supports(context.property));

		return evaluator && evaluator.evaluate(context);;
	}

	public validate(context: EvaluationContext, value: any): any {
		const evaluator = this.evaluators.find(evaluator => evaluator.supports(context.property));

		return evaluator && evaluator.validate(context, value);
	}
}

export class HistoryEvaluator implements PropertyEvaluator {
	public constructor(readonly base: PropertyEvaluator, readonly history: History) { }

	public supports(property: Property): any {
		return this.base.supports(property);
	}

	public evaluate(context: EvaluationContext): any {
		const { property, hash, evaluator } = context;
		if (hash === null || property.view) {
			return this.base.evaluate(context);
		} else if (this.history && hash in this.history.commands) {
			const command = this.history.commands[hash];
			const prevValue = evaluator.evaluate({ ...context, hash: command.parent });
			if (prevValue !== undefined) {
				const related = command.operations.filter(x => x.target === property.key);
				if (related.length > 0) {
					const value = related.reduce((value, op) => op.apply(value), prevValue);
					const validated = evaluator.validate(context, value);
					return validated;
				}
			}
		}

		return undefined;
	}

	public validate(context: EvaluationContext, value: any): any {
		return this.base.validate(context, value);
	}
}

export class CacheEvaluator implements PropertyEvaluator {
	public constructor(readonly base: PropertyEvaluator, readonly cache: Cache = new ObjectCache()) { }

	public supports(property: Property): boolean {
		return this.base.supports(property);
	}

	public evaluate(context: EvaluationContext): any {
		const { property: { key }, hash } = context;
		if (!this.cache.has(hash, key)) {
			this.cache.set(hash, key, undefined);
			const value = this.base.evaluate(context);
			this.cache.set(hash, key, value);
		}
		return this.cache.get(hash, key);
	}

	public validate(context: EvaluationContext, value: any): any {
		return this.base.validate(context, value);
	}
}

export class VoidEvaluator implements PropertyEvaluator {
	public static readonly instance: VoidEvaluator = new VoidEvaluator();
	private constructor() { }
	public supports(): false { return false; }
	public evaluate(): undefined { return undefined; }
	public validate(): undefined { return undefined; }
}