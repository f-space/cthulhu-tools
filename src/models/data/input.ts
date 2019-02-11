import { Dice } from "models/dice";
import { validate } from "./validation";

export enum InputType {
	Dice = 'dice',
	Number = 'number',
	Text = 'text',
}

export type InputMethodData = DiceInputMethodData | NumberInputMethodData | TextInputMethodData;
export type InputMethod = DiceInputMethod | NumberInputMethod | TextInputMethod;

interface InputMethodCommonData<T extends InputType> {
	readonly type: T;
	readonly name: string;
}

export interface DiceInputMethodData extends InputMethodCommonData<InputType.Dice> {
	readonly count: number;
	readonly max: number;
}

export interface NumberInputMethodData extends InputMethodCommonData<InputType.Number> {
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
}

export interface TextInputMethodData extends InputMethodCommonData<InputType.Text> { }

interface InputMethodCommonConfig {
	readonly name: string;
}

export interface DiceInputMethodConfig extends InputMethodCommonConfig {
	readonly count: number;
	readonly max: number;
}

export interface NumberInputMethodConfig extends InputMethodCommonConfig {
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
}

export interface TextInputMethodConfig extends InputMethodCommonConfig { }

abstract class InputMethodBase<T extends InputType> implements InputMethodCommonConfig {
	public readonly name: string;

	public abstract get type(): T;

	public constructor({ name }: InputMethodCommonConfig) {
		this.name = name;
	}

	public toJSON(): InputMethodCommonData<T> {
		return {
			type: this.type,
			name: this.name,
		};
	}

	protected static import({ name }: InputMethodCommonData<InputType>): InputMethodCommonConfig {
		return { name: validate("name", name).string().nonempty().value };
	}

	protected config(): InputMethodCommonConfig {
		const { name } = this;

		return { name };
	}
}

export class DiceInputMethod extends InputMethodBase<InputType.Dice> implements DiceInputMethodConfig {
	public readonly count: number;
	public readonly max: number;
	public readonly dices: ReadonlyArray<Dice>

	public get type(): InputType.Dice { return InputType.Dice; }

	public get default(): number[] { return this.dices.map(dice => dice.default); }

	public constructor({ count, max, ...rest }: DiceInputMethodConfig) {
		super(rest);

		this.count = count;
		this.max = max;
		this.dices = Dice.create(count, max);
	}

	public static from(data: DiceInputMethodData): DiceInputMethod {
		return new DiceInputMethod(this.import(data));
	}

	public toJSON(): DiceInputMethodData {
		return Object.assign(super.toJSON(), {
			count: this.count,
			max: this.max,
		});
	}

	public set(config: Partial<DiceInputMethodConfig>): DiceInputMethod {
		return new DiceInputMethod(Object.assign(this.config(), config));
	}

	public evaluate(data: any): number | undefined {
		return this.validate(data) ? this.dices.reduce((sum, dice, index) => sum + dice.value(data[index]), 0) : undefined;
	}

	public validate(data: any): data is number[] {
		return (Array.isArray(data) && data.length === this.count && data.every(x => Number.isSafeInteger(x) && x >= 0 && x < this.max));
	}

	protected static import({ count, max, ...rest }: DiceInputMethodData): DiceInputMethodConfig {
		return Object.assign(InputMethodBase.import(rest), {
			count: validate("count", count).int().min(0).max(10).value,
			max: validate("max", max).int().min(1).max(100).value,
		});
	}

	protected config(): DiceInputMethodConfig {
		const { count, max } = this;

		return Object.assign(super.config(), { count, max });
	}
}

export class NumberInputMethod extends InputMethodBase<InputType.Number> implements NumberInputMethodConfig {
	public readonly min?: number;
	public readonly max?: number;
	public readonly step?: number;

	public get type(): InputType.Number { return InputType.Number; }

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

	public constructor({ min, max, step, ...rest }: NumberInputMethodConfig) {
		super(rest);

		this.min = min;
		this.max = max;
		this.step = step;
	}

	public static from(data: NumberInputMethodData): NumberInputMethod {
		return new NumberInputMethod(this.import(data));
	}

	public toJSON(): NumberInputMethodData {
		return Object.assign(super.toJSON(), {
			min: this.min,
			max: this.max,
			step: this.step,
		});
	}

	public set(config: Partial<NumberInputMethodConfig>): NumberInputMethod {
		return new NumberInputMethod(Object.assign(this.config(), config));
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

	protected static import({ min, max, step, ...rest }: NumberInputMethodData): NumberInputMethodConfig {
		return Object.assign(super.import(rest), {
			min: validate("min", min).optional(v => v.number()).value,
			max: validate("max", max).optional(v => v.number()).value,
			step: validate("step", step).optional(v => v.number().positive()).value,
		});
	}

	protected config(): NumberInputMethodConfig {
		const { min, max, step } = this;

		return Object.assign(super.config(), { min, max, step });
	}
}

export class TextInputMethod extends InputMethodBase<InputType.Text> implements TextInputMethodConfig {
	public get type(): InputType.Text { return InputType.Text; }

	public get default(): string { return ""; }

	public constructor({ ...rest }: TextInputMethodConfig) {
		super(rest);
	}

	public static from(data: TextInputMethodData): TextInputMethod {
		return new TextInputMethod(this.import(data));
	}

	public toJSON(): TextInputMethodData {
		return super.toJSON();
	}

	public set(config: Partial<TextInputMethodConfig>): TextInputMethod {
		return new TextInputMethod(Object.assign(this.config(), config));
	}

	public evaluate(data: any): string | undefined {
		return this.validate(data) ? data : undefined;
	}

	public validate(data: any): data is string {
		return typeof data === 'string';
	}

	protected static import({ ...rest }: TextInputMethodData): TextInputMethodConfig {
		return super.import(rest);
	}

	protected config(): TextInputMethodConfig {
		return super.config();
	}
}

export const InputMethod = {
	from(data: InputMethodData): InputMethod {
		switch (data.type) {
			case InputType.Dice: return DiceInputMethod.from(data);
			case InputType.Number: return NumberInputMethod.from(data);
			case InputType.Text: return TextInputMethod.from(data);
			default: throw new Error(`Invalid input type: ${(data as any).type}`);
		}
	},

	is(value: unknown): value is InputMethod {
		return value instanceof InputMethodBase;
	},
}