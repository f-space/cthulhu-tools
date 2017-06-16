export interface Property {
	readonly id: string;
	readonly dependencies: ReadonlyArray<string>
	readonly view: boolean;
}

export interface PropertyProvider {
	property(id: string): Property | undefined;
}

export interface PropertyEvaluator {
	supports(property: Property): boolean;
	evaluate(property: Property, resolver: PropertyResolver): any;
	validate(property: Property, resolver: PropertyResolver, value: any): any;
}

export interface PropertyResolver {
	readonly provider: PropertyProvider;
	readonly evaluator: PropertyEvaluator;
	resolve(id: string): any;
}

export class CompositeProvider implements PropertyProvider {
	public readonly providers: ReadonlyArray<PropertyProvider>;

	public constructor(providers: PropertyProvider[]) {
		this.providers = Array.from(providers);
	}

	property(id: string): Property | undefined {
		for (const provider of this.providers) {
			const property = provider.property(id);
			if (property !== undefined) return property;
		}
		return undefined;
	}
}

export class CompositeEvaluator implements PropertyEvaluator {
	public readonly evaluators: ReadonlyArray<PropertyEvaluator>;

	public constructor(evaluators: PropertyEvaluator[]) {
		this.evaluators = Array.from(evaluators);
	}

	public supports(property: Property): boolean {
		return this.evaluators.some(x => x.supports(property));
	}

	public evaluate(property: Property, resolver: PropertyResolver): any {
		const evaluator = this.evaluators.find(x => x.supports(property));

		return (evaluator && evaluator.evaluate(property, resolver));
	}

	public validate(property: Property, resolver: PropertyResolver, value: any): any {
		const evaluator = this.evaluators.find(x => x.supports(property));

		return (evaluator && evaluator.validate(property, resolver, value));
	}
}

export class SimpleResolver implements PropertyResolver {
	private _cache: { [id: string]: any };

	public constructor(readonly provider: PropertyProvider, readonly evaluator: PropertyEvaluator) {
		this.clear();
	}

	public resolve(id: string): any {
		if (!(id in this._cache)) {
			this._cache[id] = undefined;

			const property = this.provider.property(id);
			if (property && this.evaluator.supports(property)) {
				const evaluated = this.evaluator.evaluate(property, this);
				const validated = this.evaluator.validate(property, this, evaluated);

				this._cache[id] = validated;
			}
		}

		return this._cache[id];
	}

	public clear(): void {
		this._cache = Object.create(null);
	}
}