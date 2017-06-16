type InputType = 'dice' | 'number' | 'text';

interface InputMethodMap {
	'dice': DiceInputMethod;
	'number': NumberInputMethod;
	'text': TextInputMethod;
}

interface InputMethodDataMap {
	'dice': DiceInputMethodData;
	'number': NumberInputMethodData;
	'text': TextInputMethodData;
}

interface InputDataMap {
	'dice': number[];
	'number': number;
	'text': string;
}

interface Typed<T extends InputType> {
	readonly type: T;
}

type TypedInputMethodDataMap = {[T in InputType]: Typed<T> & InputMethodDataMap[T]};

export type InputMethod = InputMethodMap[InputType];
export type InputMethodData = InputMethodDataMap[InputType];
export type TypedInputMethodData<T extends InputType = InputType> = TypedInputMethodDataMap[T];

interface CommonInputMethodData {
	readonly name: string;
}

export interface DiceInputMethodData extends CommonInputMethodData {
	readonly count: number;
	readonly max: number;
}

export interface NumberInputMethodData extends CommonInputMethodData {
	readonly min?: number;
	readonly max?: number;
	readonly step?: number;
}

export interface TextInputMethodData extends CommonInputMethodData { }

export type InputValue = { readonly [id: string]: any };

abstract class InputMethodBase<T extends InputType = InputType> implements Typed<T>, CommonInputMethodData {
	public readonly name: string;
	public abstract get type(): T;

	public constructor(data: CommonInputMethodData);
	public constructor(name: string);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof (args[0]) === 'object') {
			const data = args[0] as CommonInputMethodData;

			this.name = String(data.name);
		} else {
			const name = args[0] as string;

			this.name = name;
		}
	}

	public toJSON(): Typed<T> & CommonInputMethodData {
		return {
			type: this.type,
			name: this.name,
		}
	}

	public abstract evaluate(data: InputData | null): InputValue;
}

export class DiceInputMethod extends InputMethodBase<'dice'> implements TypedInputMethodData<'dice'> {
	public readonly count: number;
	public readonly max: number;
	public get type(): 'dice' { return 'dice'; }

	public constructor(data: DiceInputMethodData);
	public constructor(name: string, count: number, max: number);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as DiceInputMethodData;

			super(data);
			this.count = Number(data.count);
			this.max = Number(data.max);
		} else {
			const name = args[0] as string;
			const count = args[1] as number;
			const max = args[2] as number;

			super(name);
			this.count = count;
			this.max = max;
		}
	}

	public toJSON(): TypedInputMethodData<'dice'> {
		return Object.assign(super.toJSON(), {
			count: this.count,
			max: this.max,
		});
	}

	public evaluate(data: InputData | null): InputValue {
		const dices = (data !== null && data.get(this)) || Array(this.count).fill(0) as number[];
		const values = dices.reduce((values, value, index) => Object.assign(values, { [this.name + index.toString(10)]: Number(value) }), {});
		const sum = dices.reduce((sum, value) => sum + Number(value), 0);

		return Object.assign(values, { [this.name]: sum });
	}
}

export class NumberInputMethod extends InputMethodBase<'number'> implements TypedInputMethodData<'number'>{
	private readonly _min?: number;
	private readonly _max?: number;
	private readonly _step?: number;
	public get type(): 'number' { return 'number'; }
	public get min(): number { return (this._min !== undefined ? this._min : -Infinity); }
	public get max(): number { return (this._max !== undefined ? this._max : Infinity); }
	public get step(): number { return (this._step !== undefined ? this._step : 1); }

	public constructor(data: NumberInputMethodData);
	public constructor(name: string, min?: number, max?: number, step?: number);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as NumberInputMethodData;

			super(data);
			if (Number.isFinite(<any>data.min)) this._min = data.min;
			if (Number.isFinite(<any>data.max)) this._max = data.max;
			if (Number.isFinite(<any>data.step)) this._step = data.step;
		} else {
			const name = args[0] as string;
			const min = args[1] as number | undefined;
			const max = args[2] as number | undefined;
			const step = args[3] as number | undefined;

			super(name);
			if (Number.isFinite(<any>min)) this._min = min;
			if (Number.isFinite(<any>max)) this._max = max;
			if (Number.isFinite(<any>step)) this._step = step;
		}
	}

	public toJSON(): TypedInputMethodData<'number'> {
		return Object.assign(super.toJSON(), {
			min: this._min,
			max: this._max,
			step: this._step,
		});
	}

	public evaluate(data: InputData | null): InputValue {
		return { [this.name]: Number((data !== null && data.get(this)) || 0) };
	}
}

export class TextInputMethod extends InputMethodBase<'text'> implements TypedInputMethodData<'text'>{
	public get type(): 'text' { return 'text'; }

	public constructor(data: TextInputMethodData);
	public constructor(name: string);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as TextInputMethodData;

			super(data);
		} else {
			const name = args[0] as string;

			super(name);
		}
	}

	public toJSON(): TypedInputMethodData<'text'> {
		return super.toJSON();
	}

	public evaluate(data: InputData | null): InputValue {
		return { [this.name]: String((data !== null && data.get(this)) || "") };
	}
}

export namespace InputMethod {
	export function from(data: TypedInputMethodData): InputMethod {
		switch (data.type) {
			case 'dice': return new DiceInputMethod(data);
			case 'number': return new NumberInputMethod(data);
			case 'text': return new TextInputMethod(data);
			default: throw new Error("Invalid input type.");
		}
	}
}

export type InputTable = { [name: string]: any };

export class InputData {
	private _data: InputTable;

	public constructor(data?: InputTable | InputData) {
		this.clear();
		this.merge(data);
	}

	public toJSON(): InputTable {
		return this._data;
	}

	public clear(): void {
		this._data = Object.create(null);
	}

	public contains(name: string): boolean {
		return (name in this._data);
	}

	public get<T extends InputMethod>(input: T): InputDataMap[T['type']] | undefined {
		return this.getByName(input.name);
	}

	public set<T extends InputMethod>(input: T, value: InputDataMap[T['type']] | undefined): void {
		this.setByName(input.name, value);
	}

	public getByName<T extends InputType>(name: string): InputDataMap[T] | undefined {
		return this._data[name];
	}

	public setByName<T extends InputType>(name: string, value: InputDataMap[T] | undefined): void {
		if (value !== undefined) {
			this._data[name] = value;
		} else {
			delete this._data[name];
		}
	}

	public merge(data?: InputTable | InputData): void {
		if (data instanceof InputData) {
			Object.assign(this._data, data._data);
		} else {
			Object.assign(this._data, data);
		}
	}
}

export type InputDataTable = { [name: string]: InputTable | InputData };
export type StrictInputDataTable = { [name: string]: InputData };

export class InputDataSet {
	private _data: StrictInputDataTable;

	public constructor(data?: InputDataTable | InputDataSet) {
		this.clear();
		this.merge(data);
	}

	public toJSON(): InputDataTable {
		return this._data;
	}

	public clear(): void {
		this._data = Object.create(null);
	}

	public contains(id: string): boolean {
		return (id in this._data);
	}

	public get(id: string): InputData | undefined {
		return this._data[id];
	}

	public getInput<T extends InputMethod>(id: string, input: T): InputDataMap[T['type']] | undefined {
		return (this.contains(id) ? this._data[id].get(input) : undefined);
	}

	public set(id: string, value: InputTable | InputData, replace: boolean = false): void {
		if (replace || !this.contains(id)) {
			this._data[id] = new InputData(value);
		} else {
			this._data[id].merge(value);
		}
	}

	public setInput<T extends InputMethod>(id: string, input: T, value: InputDataMap[T['type']] | undefined): void {
		(this.contains(id) ? this._data[id] : (this._data[id] = new InputData())).set(input, value);
	}

	public merge(data?: InputDataTable | InputDataSet): void {
		if (data instanceof InputDataSet) {
			for (const key of Object.keys(data._data)) {
				this._data[key] = new InputData(data._data[key]);
			}
		} else if (data !== undefined) {
			for (const key of Object.keys(data)) {
				this._data[key] = new InputData(data[key]);
			}
		}
	}
}
