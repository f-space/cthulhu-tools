import { Reference } from "models/expression";
import { Property } from "models/property";
import { Cache, ObjectCache } from "models/cache";

export interface ResolutionContext {
	readonly chain: EvaluationChain;
	readonly ref: Reference;
}

export interface EvaluationContext extends ResolutionContext {
	readonly property: Property;
	readonly hash: string | null;
}

export interface ValidationContext extends EvaluationContext {
	readonly value: any;
}

export interface PropertyResolver {
	resolve(context: ResolutionContext): Property | undefined;
}

export interface PropertyEvaluator {
	evaluate(context: EvaluationContext): any;
}

export interface PropertyValidator {
	validate(context: ValidationContext): any;
}

export interface EvaluationConfig {
	resolver?: PropertyResolver;
	evaluator?: PropertyEvaluator;
	validator?: PropertyValidator;
	cache?: Cache;
}

export class EvaluationChain {
	public readonly resolver: PropertyResolver;
	public readonly evaluator: PropertyEvaluator;
	public readonly validator: PropertyValidator;
	public readonly cache: Cache;

	public constructor(config: EvaluationConfig) {
		this.resolver = config.resolver || { resolve: ctx => undefined };
		this.evaluator = config.evaluator || { evaluate: ctx => undefined };
		this.validator = config.validator || { validate: ctx => ctx.value };
		this.cache = config.cache || new ObjectCache();
	}

	public evaluate(ref: Reference, hash: string | null): any {
		if (!this.cache.has(hash, ref.key)) {
			this.cache.set(hash, ref.key, undefined);

			const chain = this;
			const property = this.resolver.resolve({ chain, ref });
			if (property !== undefined) {
				const value = this.evaluator.evaluate({ chain, ref, property, hash });
				const result = this.validator.validate({ chain, ref, property, hash, value });

				this.cache.set(hash, ref.key, result);
			}
		}

		return this.cache.get(hash, ref.key);
	}
}