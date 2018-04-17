import { Dice } from "models/dice";
import * as validation from "models/validation";

type InputType = 'dice' | 'number' | 'text';

interface InputMethodDataMap {
	'dice': DiceInputMethodData;
	'number': NumberInputMethodData;
	'text': TextInputMethodData;
}

interface InputMethodMap {
	'dice': DiceInputMethod;
	'number': NumberInputMethod;
	'text': TextInputMethod;
}

interface InputMethodParamTypeMap {
	'dice': number[];
	'number': number;
	'text': string;
}

interface InputMethodValueTypeMap {
	'dice': number;
	'number': number;
	'text': string;
}

export type InputMethodData = InputMethodDataMap[InputType]
export type InputMethod = InputMethodMap[InputType];

interface InputMethodDataBase<T extends InputType> {
	readonly type: T;
	readonly name: string;
}

export interface DiceInputMethodData extends InputMethodDataBase<'dice'> {
	readonly count: number;
	readonly max: number;
}

export interface NumberInputMethodData extends InputMethodDataBase<'number'> {
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
}

export interface TextInputMethodData extends InputMethodDataBase<'text'> { }

abstract class InputMethodBase<T extends InputType> {
	public readonly type: T;
	public readonly name: string;

	public abstract get default(): InputMethodParamTypeMap[T];

	public constructor({ type, name }: InputMethodDataBase<T>) {
		this.type = validation.string_enum(type);
		this.name = validation.string(name);
	}

	public toJSON(): InputMethodDataBase<T> {
		return {
			type: this.type,
			name: this.name,
		};
	}

	public abstract evaluate(data: any): InputMethodValueTypeMap[T] | undefined;
	public abstract validate(data: any): data is InputMethodParamTypeMap[T];
}

export class DiceInputMethod extends InputMethodBase<'dice'> {
	public readonly count: number;
	public readonly max: number;
	public readonly dices: ReadonlyArray<Dice>

	public get default(): number[] { return this.dices.map(dice => dice.default); }

	public constructor({ count, max, ...rest }: DiceInputMethodData) {
		super(rest);
		this.count = validation.int(count, 0);
		this.max = validation.int(max, 1);
		this.dices = Dice.create(this.count, this.max);
	}

	public toJSON(): DiceInputMethodData {
		return Object.assign(super.toJSON(), {
			count: this.count,
			max: this.max,
		});
	}

	public evaluate(data: any): number | undefined {
		return this.validate(data) ? this.dices.reduce((sum, dice, index) => sum + dice.value(data[index]), 0) : undefined;
	}

	public validate(data: any): data is number[] {
		return (Array.isArray(data) && data.length === this.count && data.every(x => Number.isSafeInteger(x) && x >= 0 && x < this.max));
	}
}

export class NumberInputMethod extends InputMethodBase<'number'> {
	public readonly min?: number;
	public readonly max?: number;
	public readonly step?: number;

	public get default(): number {
		if (this.min !== undefined) return this.min;
		if (this.max !== undefined) {
			if (this.step !== undefined) {
				return (Math.floor(this.max / this.step) * this.step);
			} else {
				return this.max;
			}
		}
		return 0;
	}

	public get origin(): number { return this.min !== undefined ? this.min : 0; }

	public constructor({ min, max, step, ...rest }: NumberInputMethodData) {
		super(rest);
		this.min = validation.finite(min);
		this.max = validation.finite(max);
		this.step = validation.positive(validation.finite(step));
	}

	public toJSON(): NumberInputMethodData {
		return Object.assign(super.toJSON(), {
			min: this.min,
			max: this.max,
			step: this.step,
		});
	}

	public evaluate(data: any): number | undefined {
		if (this.validate(data)) {
			if (this.step !== undefined) {
				const origin = this.origin;
				const scale = Math.round((data - origin) / this.step);
				return (origin + this.step * scale);
			} else {
				return data;
			}
		}
		return undefined;
	}

	public validate(data: any): data is number {
		if (typeof data !== 'number') return false;
		if (this.min !== undefined && data < this.min) return false;
		if (this.max !== undefined && data > this.max) return false;
		if (this.step !== undefined && Math.abs(data - this.origin) % this.step > Number.EPSILON) return false;
		return true;
	}
}

export class TextInputMethod extends InputMethodBase<'text'> {
	public get default(): string { return ""; }

	public constructor({ ...rest }: TextInputMethodData) {
		super(rest);
	}

	public toJSON(): TextInputMethodData {
		return super.toJSON();
	}

	public evaluate(data: any): string | undefined {
		return this.validate(data) ? data : undefined;
	}

	public validate(data: any): data is string {
		return typeof data === 'string';
	}
}

export namespace InputMethod {
	export function from(data: any): InputMethod {
		switch (data.type) {
			case 'dice': return new DiceInputMethod(data);
			case 'number': return new NumberInputMethod(data);
			case 'text': return new TextInputMethod(data);
			default: throw new Error(`Invalid input type: ${data.type}`);
		}
	}
}