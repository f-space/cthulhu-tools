export type DiceDisplayType = '6' | '10' | '10x10';
export type DiceType = 'D6' | 'D10' | 'D100' | 'any';

export interface DiceDisplay {
	readonly type: DiceDisplayType;
	readonly face: number;
}

export interface Dice {
	readonly type: DiceType;
	readonly faces: number;
	readonly default: number;
	readonly max: number;
	value(face: number): number;
	display(face: number): DiceDisplay[];
}

export abstract class StandardDice<T extends DiceType> implements Dice {
	protected constructor(readonly type: T, readonly faces: number) { }
	public get default(): number { return (this.faces - 1); }
	public get max(): number { return (this.faces - 1); }
	public value(face: number): number { return (face + 1); }
	public abstract display(face: number): DiceDisplay[];
}

export class Dice6 extends StandardDice<'D6'> {
	public constructor(faces: number) { super('D6', faces); }
	public display(face: number): [DiceDisplay] { return [{ type: '6', face: this.value(face) - 1 }]; }
}

export class Dice10 extends StandardDice<'D10'>  {
	public constructor(faces: number) { super('D10', faces); }
	public display(face: number): [DiceDisplay] { return [{ type: '10', face: this.value(face) % 10 }]; }
}

export class Dice100 extends StandardDice<'D100'> {
	public constructor(faces: number) { super('D100', faces); }
	public display(face: number): [DiceDisplay, DiceDisplay] {
		const value = this.value(face);
		return [
			{ type: '10x10', face: Math.floor(value / 10) % 10 },
			{ type: '10', face: value % 10 }
		];
	}
}

export class DiceAny extends StandardDice<'any'> {
	public constructor(faces: number) { super('any', faces); }
	public display(face: number): DiceDisplay[] {
		const value = this.value(face);
		const digits = Math.ceil(Math.log10(this.faces));
		return Array.from(Array(digits), (_, index) => {
			return { type: '10', face: Math.floor(value / Math.pow(10, digits - index - 1)) % 10 } as DiceDisplay
		});
	}
}

const DICE_REGEX = /[1-9]\d*D[1-9]\d*/;

function select(max: number): Dice {
	if (max <= 6) return new Dice6(max);
	if (max <= 10) return new Dice10(max);
	if (max <= 100) return new Dice100(max);
	return new DiceAny(max);
}

function create(count: number, max: number): Dice[] {
	return Array.from(Array(count), () => select(max));
}

function test(expression: string): boolean {
	return DICE_REGEX.test(expression);
}

function parse(expression: string): Dice[] {
	if (!test(expression)) throw new Error(`Invalid expression: ${expression}`);

	const [first, second] = expression.split("D");
	const count = parseInt(first, 10);
	const max = parseInt(second, 10);

	return create(count, max);
}

export const Dice = {
	select,
	create,
	test,
	parse,
};