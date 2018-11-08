import { Hash, Reference, Expression } from "models/data";
import { Cache } from "./cache";
import { PropertyResolver, VoidResolver } from "./resolver";
import { PropertyEvaluator, VoidEvaluator } from "./evaluator";
import { PropertyValidator, VoidValidator } from "./validator";

export * from "./resolver";
export * from "./evaluator";
export * from "./validator";

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

	public get hash(): string {
		return Hash.get(this, self => self.resolver.hash + self.evaluator.hash + self.validator.hash).hex;
	}

	public constructor(config: EvaluationConfig) {
		this.resolver = config.resolver || new VoidResolver();
		this.evaluator = config.evaluator || new VoidEvaluator();
		this.validator = config.validator || new VoidValidator();
		this.cache = config.cache || new Map();
		this.evaluate = this.evaluate.bind(this);
	}

	public evaluate(ref: Reference, time: string | null): any {
		const key = Hash.from(this.hash + ref.key + time || '').hex;
		if (!this.cache.has(key)) {
			this.cache.set(key, undefined);

			const request = this.evaluate;
			const property = this.resolver.resolve({ ref });
			if (property !== undefined) {
				const value = this.evaluator.evaluate({ ref, time, property, request });
				const result = this.validator.validate({ ref, time, property, value, request });

				this.cache.set(key, result);
			}
		}

		return this.cache.get(key);
	}

	public evaluateExpression(expression: Expression, hash: string | null, vars: any = {}): number | undefined {
		const values = new Map<string, any>();
		expression.refs.forEach(reference => values.set(reference.key, this.evaluate(reference, hash)));
		expression.vars.forEach(variable => values.set(variable.key, vars[variable.key]));
		return expression.evaluate(values);
	}
}