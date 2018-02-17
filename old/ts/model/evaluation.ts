import { PropertyResolver } from "./property"
import { Parser, Expression, Values } from "expr-eval";

export default function evaluate(expression: string, resolver: PropertyResolver, map?: Values): any {
	const parser = new CustomParser();
	const result = parser.parse(expression);

	const values = Object.create(null);
	for (const variable of result.variables()) {
		if (map !== undefined && Object.prototype.hasOwnProperty.call(map, variable)) {
			values[variable] = map[variable];
		} else {
			values[variable] = resolver.resolve(variable);
		}
	}

	return result.evaluate(values);
}

class CustomParser extends Parser {
	public constructor() {
		super();

		this.customize();
	}

	private customize(this: any): void {
		this.unaryOps = {
			'-': (x: number) => -x,
			'+': (x: number) => +x,
			'!': (x: any) => !x,
		};

		this.functions = {
			abs: Math.abs,
			ceil: Math.ceil,
			floor: Math.floor,
			round: Math.round,
			trunc: Math.trunc,
			random: Math.random,
			min: Math.min,
			max: Math.max,
		};

		this.consts = {
			true: true,
			false: false
		};
	}
}