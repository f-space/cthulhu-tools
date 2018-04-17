import { Character, AttributeParams, SkillParams } from "models/character";
import { Attribute, IntegerAttribute, NumberAttribute, TextAttribute } from "models/attribute";
import { Skill } from "models/skill";
import { History } from "models/history";
import { Property } from "models/property";
import { PropertyResolver, AttributeResolver, SkillResolver, CompoundResolver, VoidResolver } from "models/resolver";
import { Cache, ObjectCache } from "models/cache";
import { Expression } from "models/expression";

export interface PropertyEvaluator {
	readonly resolver: PropertyResolver;
	evaluate(id: string, hash: string | null, root?: PropertyEvaluator): any;
	replace(replacer: PropertyEvaluatorReplacer): PropertyEvaluator;
}

export interface PropertyEvaluatorReplacer {
	(original: PropertyEvaluator): PropertyEvaluator | null;
}

export class AttributeEvaluator implements PropertyEvaluator {
	public constructor(readonly resolver: AttributeResolver, readonly data: AttributeParams) { }

	public evaluate(id: string, hash: string | null, root: PropertyEvaluator = this): any {
		const property = this.resolver.resolve(id);
		if (property !== undefined) {
			const attribute = property.entity;
			const values = this.evaluateValues(attribute, hash, root);

			switch (attribute.type) {
				case 'integer': return this.evaluateInteger(attribute, values);
				case 'number': return this.evaluateNumber(attribute, values);
				case 'text': return this.evaluateText(attribute, values);
			}
		}

		return undefined;
	}

	public replace(replacer: PropertyEvaluatorReplacer): PropertyEvaluator {
		return replacer(this) || new AttributeEvaluator(this.resolver, this.data);
	}

	private evaluateValues(attribute: Attribute, hash: string | null, root: PropertyEvaluator): any {
		const data = this.data[attribute.id] || Object.create(null);
		const values = new Map<string, any>();

		let dependencies = ("expression" in attribute ? attribute.expression : attribute.format).refs;
		if ("min" in attribute && attribute.min) dependencies = dependencies.concat(attribute.min.refs);
		if ("max" in attribute && attribute.max) dependencies = dependencies.concat(attribute.max.refs);

		for (const dependency of dependencies) {
			if (dependency.key) {
				values.set(dependency.key, root.evaluate(dependency.key, hash, root));
			}
		}

		for (const input of attribute.inputs) {
			if (input.name) {
				values.set(`\$${input.name}`, input.evaluate(data[input.name]));
			}
		}

		return values;
	}

	private evaluateInteger(attribute: IntegerAttribute, values: Map<string, any>): number | undefined {
		const value = attribute.expression.evaluate(values);
		if (value !== undefined) {
			const min = attribute.min ? attribute.min.evaluate(values) : Number.MIN_SAFE_INTEGER;
			const max = attribute.max ? attribute.max.evaluate(values) : Number.MAX_SAFE_INTEGER;

			if (min !== undefined && max !== undefined) return Math.max(Math.min(value, max), min);
		}

		return undefined;
	}

	private evaluateNumber(attribute: NumberAttribute, values: Map<string, any>): number | undefined {
		const value = attribute.expression.evaluate(values);
		if (value !== undefined) {
			const min = attribute.min ? attribute.min.evaluate(values) : -Infinity;
			const max = attribute.max ? attribute.max.evaluate(values) : Infinity;

			if (min !== undefined && max !== undefined) return Math.max(Math.min(value, max), min);
		}

		return undefined;
	}

	private evaluateText(attribute: TextAttribute, values: Map<string, any>): string | undefined {
		const value = attribute.format.evaluate(values);

		return value !== undefined ? String(value) : undefined;
	}
}

export class SkillEvaluator implements PropertyEvaluator {
	public readonly min: number;
	public readonly max: number;

	public constructor(readonly resolver: SkillResolver, readonly data: SkillParams, min: number = 0, max: number = 99) {
		this.min = Number.isSafeInteger(min) ? min : Number.MIN_SAFE_INTEGER;
		this.max = Number.isSafeInteger(max) ? max : Number.MAX_SAFE_INTEGER;
	}

	public evaluate(id: string, hash: string | null, root: PropertyEvaluator = this): any {
		const property = this.resolver.resolve(id);
		if (property !== undefined) {
			const skill = property.entity;
			const values = this.evaluateValues(skill, hash, root);

			const base = this.evaluateBase(skill, values);
			const points = this.data[skill.id] !== undefined ? Math.trunc(this.data[skill.id]) : 0;

			if (base !== undefined) return Math.max(Math.min(base + points, this.max), this.min);
		}

		return undefined;
	}

	public replace(replacer: PropertyEvaluatorReplacer): PropertyEvaluator {
		return replacer(this) || new SkillEvaluator(this.resolver, this.data, this.min, this.max);
	}

	private evaluateValues(skill: Skill, hash: string | null, root: PropertyEvaluator): any {
		const values = new Map<string, any>();
		for (const ref of skill.base.refs) {
			if (ref.key) {
				values.set(ref.key, root.evaluate(ref.key, hash, root));
			}
		}

		return values;
	}

	private evaluateBase(skill: Skill, values: Map<string, any>): number | undefined {
		const value = skill.base.evaluate(values);

		return value !== undefined ? Math.trunc(value) : undefined;
	}
}

export class CompoundEvaluator implements PropertyEvaluator {
	public readonly resolver: CompoundResolver;

	public constructor(readonly evaluators: ReadonlyArray<PropertyEvaluator>) {
		this.resolver = new CompoundResolver(evaluators.map(evaluator => evaluator.resolver));
	}

	public evaluate(id: string, hash: string | null, root: PropertyEvaluator = this): any {
		for (const evaluator of this.evaluators) {
			const value = evaluator.evaluate(id, hash, root);

			if (value !== undefined) return value;
		}

		return undefined;
	}

	public replace(replacer: PropertyEvaluatorReplacer): PropertyEvaluator {
		return replacer(this) || new CompoundEvaluator(
			this.evaluators
				.map(evaluator => evaluator.replace(replacer))
				.filter(evaluator => evaluator !== VoidEvaluator.instance)
		);
	}
}

export class HistoryEvaluator implements PropertyEvaluator {
	public get resolver(): PropertyResolver { return this.base.resolver; }

	public constructor(readonly base: PropertyEvaluator, readonly history: History) { }

	public evaluate(id: string, hash: string | null, root: PropertyEvaluator = this): any {
		const property = this.resolver.resolve(id);
		if (property !== undefined) {
			if (hash === null || property.view) {
				return this.base.evaluate(id, hash, root);
			} else if (this.history && hash in this.history.commands) {
				const command = this.history.commands[hash];
				const oldValue = root.evaluate(id, command.parent);
				if (oldValue !== undefined) {
					return command.operations
						.filter(x => x.target === id)
						.reduce((value, op) => op.apply(value), oldValue);
				}
			}
		}

		return undefined;
	}

	public replace(replacer: PropertyEvaluatorReplacer): PropertyEvaluator {
		return replacer(this) || new HistoryEvaluator(this.base.replace(replacer), this.history);
	}
}

export class CacheEvaluator implements PropertyEvaluator {
	public get resolver(): PropertyResolver { return this.base.resolver; }

	public constructor(readonly base: PropertyEvaluator, readonly cache: Cache = new ObjectCache()) { }

	public evaluate(id: string, hash: string | null, root: PropertyEvaluator = this): any {
		if (!this.cache.has(hash, id)) {
			this.cache.set(hash, id, undefined);
			const value = this.base.evaluate(id, hash, this);
			this.cache.set(hash, id, value);
		}
		return this.cache.get(hash, id);
	}

	public replace(replacer: PropertyEvaluatorReplacer): PropertyEvaluator {
		return replacer(this) || new CacheEvaluator(this.base.replace(replacer));
	}
}

export class VoidEvaluator implements PropertyEvaluator {
	public static readonly instance: VoidEvaluator = new VoidEvaluator();
	public get resolver(): VoidResolver { return VoidResolver.instance; }
	public evaluate(): undefined { return undefined; }
	public replace(replacer: PropertyEvaluatorReplacer): PropertyEvaluator { return replacer(this) || this; }
}