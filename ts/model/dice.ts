function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max) | 0;
}

export enum DiceType {
	D6,
	D10,
	D100,
}

export class Dice {
	public constructor(readonly type: DiceType, public face: number) { }
}

export interface DiceGroup {
	value: number;
	readonly max: number;
	readonly dices: ReadonlyArray<Dice>;
}

export namespace DiceGroup {
	export function select(max: number): DiceGroup {
		if (max <= 0) throw new Error("'max' is too small.");
		if (max > 100) throw new Error("'max' is too large.");

		if (max <= 6) return new D6(max);
		if (max <= 10) return new D10(max);
		if (max <= 100) return new D100(max);

		throw new Error("Unreachable path.");
	}
}

export class D6 implements DiceGroup {
	private _max: number;
	private _dice: Dice;

	get value(): number { return this._dice.face; }
	set value(value: number) { this._dice.face = clamp(value, 1, this.max); }
	get max(): number { return this._max; }
	get dices(): ReadonlyArray<Dice> { return [this._dice]; }

	public constructor(max: number) {
		this._max = clamp(max, 1, 6);
		this._dice = new Dice(DiceType.D6, 1);

		this.value = 1;
	}
}

export class D10 implements DiceGroup {
	private _max: number;
	private _dice: Dice;

	get value(): number { return (this._dice.face !== 0 ? this._dice.face : 10); }
	set value(value: number) { this._dice.face = clamp(value, 1, this.max) % 10; }
	get max(): number { return this._max; }
	get dices(): ReadonlyArray<Dice> { return [this._dice]; }

	public constructor(max: number) {
		this._max = clamp(max, 1, 10);
		this._dice = new Dice(DiceType.D10, 0);

		this.value = this.max;
	}
}

export class D100 implements DiceGroup {
	private _max: number;
	private _dices: [Dice, Dice];

	get value(): number { return (x => x !== 0 ? x : 100)(this._dices[0].face * 10 + this._dices[1].face); }
	set value(value: number) { (x => { this._dices[0].face = (x / 10) | 0; this._dices[1].face = x % 10 })(clamp(value, 1, this._max) % 100); }
	get max(): number { return this._max; }
	get dices(): ReadonlyArray<Dice> { return this._dices; }

	public constructor(max: number) {
		this._max = clamp(max, 1, 100);
		this._dices = [
			new Dice(DiceType.D100, 0),
			new Dice(DiceType.D10, 0),
		];

		this.value = this.max;
	}
}

export class DiceSet {
	private static readonly DICE_REGEX = /[1-9]\d*D[1-9]\d*/.compile();

	public constructor(readonly groups: ReadonlyArray<DiceGroup>) { }

	public static create(count: number, max: number) {
		const groups = <DiceGroup[]>[];
		for (let i = 0; i < count; i++) {
			groups.push(DiceGroup.select(max));
		}

		return new DiceSet(groups);
	}

	public static parse(expression: string): DiceSet {
		if (!this.DICE_REGEX.test(expression)) throw new Error("Invalid expression.");

		const [first, second] = expression.split("D");
		const count = parseInt(first, 10);
		const max = parseInt(second, 10);

		return this.create(count, max);
	}
}