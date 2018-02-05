import { Parser, Expression, Values } from "expr-eval";

export function evaluate(expression: string, values?: Values): any {
	const parser = new CustomParser();
	const result = parser.parse(expression);
	const complete = result.variables().every(x => values !== undefined && values[x] !== undefined)
	return complete ? result.evaluate(values) : undefined;
}

export function substitute(expression: string, values: Values): string {
	const parser = new CustomParser();
	const result = parser.parse(expression);
	return Object.keys(values).reduce((expr, key) => expr.substitute(key, values[key]), result as any).toString();
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