import { Reference } from "models/expression";
import { Property } from "models/property";
import { Cache, ObjectCache } from "models/cache";
import { PropertyResolver, VoidResolver } from "models/resolver";
import { PropertyEvaluator, VoidEvaluator } from "models/evaluator";
import { PropertyValidator, VoidValidator } from "models/validator";

export * from "models/resolver";
export * from "models/evaluator";
export * from "models/validator";

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
		this.resolver = config.resolver || new VoidResolver();
		this.evaluator = config.evaluator || new VoidEvaluator();
		this.validator = config.validator || new VoidValidator();
		this.cache = config.cache || new ObjectCache();
		this.evaluate = this.evaluate.bind(this);
	}

	public evaluate(ref: Reference, hash: string | null): any {
		if (!this.cache.has(hash, ref.key)) {
			this.cache.set(hash, ref.key, undefined);

			const request = this.evaluate;
			const property = this.resolver.resolve({ ref });
			if (property !== undefined) {
				const value = this.evaluator.evaluate({ ref, hash, property, request });
				const result = this.validator.validate({ ref, hash, property, value, request });

				this.cache.set(hash, ref.key, result);
			}
		}

		return this.cache.get(hash, ref.key);
	}
}