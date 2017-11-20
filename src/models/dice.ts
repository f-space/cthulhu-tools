export interface Dice {
	readonly max: number;
	readonly default: number;
	validate(value: number): boolean;
	roll(random: number): number;
}

export class StandardDice implements Dice {
	public constructor(readonly max: number) { }

	public get default() { return this.max; }

	public validate(value: number): boolean {
		return (Number.isSafeInteger(value) && value > 0 && value <= this.max);
	}

	public roll(random: number): number {
		return Math.floor(random * this.max) + 1;
	}
}

export class DiceSet implements Iterable<Dice> {
	private static readonly DICE_REGEX = /[1-9]\d*D[1-9]\d*/;

	public get size(): number { return this.dices.length; }

	public constructor(readonly dices: ReadonlyArray<Dice>) { }

	[Symbol.iterator](): Iterator<Dice> {
		return this.dices[Symbol.iterator]();
	}

	public static create(count: number, max: number): DiceSet {
		return new DiceSet(Array.from(Array(count), () => new StandardDice(max)));
	}

	public static test(expression: string): boolean {
		return this.DICE_REGEX.test(expression);
	}

	public static parse(expression: string): DiceSet {
		if (!this.test(expression)) throw new Error(`Invalid expression: ${expression}`);

		const [first, second] = expression.split("D");
		const count = parseInt(first, 10);
		const max = parseInt(second, 10);

		return this.create(count, max);
	}
}