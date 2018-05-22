import { Reference, Expression, Format } from "models/data";
import { Property } from "./property";
import { Cache, ObjectCache } from "./cache";
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

	public evaluateExpression(expression: Expression, hash: string | null, inputs: any = {}): number | undefined {
		const values = new Map<string, any>();
		expression.refs.forEach(ref => values.set(ref.key, this.evaluate(ref, hash)));
		expression.inputs.forEach(input => values.set(input.key, inputs[input.key]));
		return expression.evaluate(values);
	}

	public evaluateFormat(format: Format, hash: string | null, inputs: any = {}): string | undefined {
		const values = new Map<string, any>();
		format.refs.forEach(ref => values.set(ref.key, this.evaluate(ref, hash)));
		format.inputs.forEach(input => values.set(input.key, inputs[input.key]));
		return format.evaluate(values);
	}
}