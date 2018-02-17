import { Property, PropertyProvider, PropertyEvaluator, PropertyResolver } from "./property";
import { TypedInputMethodData, InputMethod, InputData, InputDataSet, InputValue } from "./input";
import evaluate from "./evaluation";
import { generateUUID, requestJSON } from "./utility";

type AttributeType = 'integer' | 'number' | 'text';

interface AttributeMap {
	'integer': IntegerAttribute;
	'number': NumberAttribute;
	'text': TextAttribute;
}

interface AttributeDataMap {
	'integer': IntegerAttributeData;
	'number': NumberAttributeData;
	'text': TextAttributeData;
}

interface Typed<T extends AttributeType> {
	readonly type: T;
}

type TypedAttributeDataMap = {[T in AttributeType]: Typed<T> & AttributeDataMap[T]}

export type Attribute = AttributeMap[AttributeType];
export type AttributeData = AttributeDataMap[AttributeType];
export type TypedAttributeData<T extends AttributeType = AttributeType> = TypedAttributeDataMap[T];

interface CommonAttributeData {
	readonly uuid?: string;
	readonly id: string;
	readonly name: string;
	readonly dependencies: ReadonlyArray<string>;
	readonly inputs: ReadonlyArray<TypedInputMethodData>;
	readonly expression: string;
	readonly view?: boolean;
	readonly hidden?: boolean;
}

export interface IntegerAttributeData extends CommonAttributeData {
	readonly min?: number | string;
	readonly max?: number | string;
}

export interface NumberAttributeData extends CommonAttributeData {
	readonly min?: number | string;
	readonly max?: number | string;
}

export interface TextAttributeData extends CommonAttributeData { }

abstract class AttributeBase<T extends AttributeType = AttributeType> implements Property, Typed<T>, CommonAttributeData {
	public readonly uuid: string;
	public readonly id: string;
	public readonly name: string;
	public readonly dependencies: ReadonlyArray<string>;
	public readonly inputs: ReadonlyArray<InputMethod>;
	public readonly expression: string;
	public readonly view: boolean;
	public readonly hidden: boolean;
	private _default: boolean;

	public abstract get type(): T;
	public get default(): boolean { return this._default; }

	public constructor(data: CommonAttributeData, uuid: string = data.uuid || generateUUID()) {
		this.uuid = String(uuid);
		this.id = String(data.id);
		this.name = String(data.name);
		this.dependencies = Array.from(data.dependencies).map(x => String(x));
		this.inputs = Array.from(data.inputs).map(x => InputMethod.from(x));
		this.expression = String(data.expression);
		this.view = (data.view === true);
		this.hidden = (data.hidden === true);
		this._default = false;
	}

	public toJSON(): Typed<T> & CommonAttributeData {
		return {
			type: this.type,
			uuid: this.uuid,
			id: this.id,
			name: this.name,
			dependencies: this.dependencies,
			inputs: this.inputs,
			expression: this.expression,
			view: this.view || undefined,
			hidden: this.hidden || undefined,
		};
	}

	public markAsDefault(): this {
		return (this._default = true, this);
	}

	public evaluate(data: InputData | null, resolver: PropertyResolver): any {
		return evaluate(this.expression, resolver, this.evaluateInputs(data));
	}

	public validate(data: InputData | null, resolver: PropertyResolver, value: any): any {
		return value;
	}

	protected evaluateInputs(data: InputData | null): InputValue {
		return this.inputs.reduce((values, input) => Object.assign(values, input.evaluate(data)), {});
	}
}

export class IntegerAttribute extends AttributeBase<'integer'> implements TypedAttributeData<'integer'> {
	private readonly _min?: number | string;
	private readonly _max?: number | string;

	public get type(): 'integer' { return 'integer'; }
	public get min(): number | string { return (this._min !== undefined ? this._min : -Infinity); }
	public get max(): number | string { return (this._max !== undefined ? this._max : Infinity); }

	public constructor(data: IntegerAttributeData, uuid?: string) {
		super(data, uuid);

		if (isFiniteOrString(data.min)) this._min = data.min;
		if (isFiniteOrString(data.max)) this._max = data.max;
	}

	public toJSON(): TypedAttributeData<'integer'> {
		return Object.assign(super.toJSON(), {
			min: this._min,
			max: this._max,
		});
	}

	public evaluate(data: InputData | null, resolver: PropertyResolver): number {
		return (super.evaluate(data, resolver) | 0);
	}

	public validate(data: InputData | null, resolver: PropertyResolver, value: number): number {
		let cache: InputValue;
		const inputs = () => cache || (cache = this.evaluateInputs(data));

		const min = (typeof this.min === 'number' ? this.min : evaluate(this.min, resolver, inputs()));
		const max = (typeof this.max === 'number' ? this.max : evaluate(this.max, resolver, inputs()));

		return (Math.max(Math.min(value, max), min) | 0);
	}
}

export class NumberAttribute extends AttributeBase<'number'> implements TypedAttributeData<'number'>{
	private readonly _min?: number | string;
	private readonly _max?: number | string;

	public get type(): 'number' { return 'number'; }
	public get min(): number | string { return (this._min !== undefined ? this._min : -Infinity); }
	public get max(): number | string { return (this._max !== undefined ? this._max : Infinity); }

	public constructor(data: NumberAttributeData, uuid?: string) {
		super(data, uuid);

		if (isFiniteOrString(data.min)) this._min = data.min;
		if (isFiniteOrString(data.max)) this._max = data.max;
	}

	public toJSON(): TypedAttributeData<'number'> {
		return Object.assign(super.toJSON(), {
			min: this._min,
			max: this._max,
		});
	}

	public evaluate(data: InputData | null, resolver: PropertyResolver): number {
		return Number(super.evaluate(data, resolver));
	}

	public validate(data: InputData | null, resolver: PropertyResolver, value: number): number {
		let cache: InputValue;
		const inputs = () => cache || (cache = this.evaluateInputs(data));

		const min = (typeof this.min === 'number' ? this.min : evaluate(this.min, resolver, inputs()));
		const max = (typeof this.max === 'number' ? this.max : evaluate(this.max, resolver, inputs()));

		return Math.max(Math.min(value, max), min);
	}
}

export class TextAttribute extends AttributeBase<'text'> implements TypedAttributeData<'text'>{
	public get type(): 'text' { return 'text'; }

	public constructor(data: TextAttributeData, uuid?: string) {
		super(data, uuid);
	}

	public toJSON(): TypedAttributeData<'text'> {
		return super.toJSON();
	}

	public evaluate(data: InputData | null, resolver: PropertyResolver): string {
		return String(super.evaluate(data, resolver));
	}

	public validate(data: InputData | null, resolver: PropertyResolver, value: string): string {
		return String(value);
	}
}

export namespace Attribute {
	export function from(data: TypedAttributeData): Attribute {
		switch (data.type) {
			case 'integer': return new IntegerAttribute(data);
			case 'number': return new NumberAttribute(data);
			case 'text': return new TextAttribute(data);
			default: throw new Error("Invalid attribute type.");
		}
	}
}

type AttributeTable = { [uuid: string]: Attribute };

export class AttributeManager implements Iterable<Attribute> {
	private _table: AttributeTable = Object.create(null);

	public contains(uuid: string): boolean {
		return (uuid in this._table);
	}

	public get(uuid: string): Attribute | undefined;
	public get(uuid: string[]): Attribute[];
	public get(uuid: string | string[]): any {
		if (Array.isArray(uuid)) {
			return uuid.map(x => this._table[x]).filter(x => x !== undefined);
		} else {
			return this._table[uuid];
		}
	}

	public list(): Attribute[] { return Object.keys(this._table).map(key => this._table[key]); }

	public add(attribute: Attribute): void {
		const uuid = attribute.uuid;
		const item = this._table[uuid];
		if (item === undefined || !item.default) {
			this._table[uuid] = attribute;
		}
	}

	public remove(attribute: Attribute): void {
		const uuid = attribute.uuid;
		const item = this._table[uuid];
		if (item !== undefined && !item.default) {
			delete this._table[uuid];
		}
	}

	public async load(url: string, asDefault: boolean = false): Promise<void> {
		const data = await requestJSON(url) as TypedAttributeData[];

		for (const entry of data) {
			const attribute = Attribute.from(entry);
			if (asDefault) attribute.markAsDefault();
			this.add(attribute);
		}
	}

	public import(data?: ReadonlyArray<TypedAttributeData>): void {
		if (Array.isArray(data)) {
			for (const attribute of data) {
				this.add(Attribute.from(attribute));
			}
		}
	}

	public [Symbol.iterator](): Iterator<Attribute> {
		return this.list()[Symbol.iterator]();
	}
}

type ID2UUID = { [id: string]: string };

export class AttributeProvider implements PropertyProvider {
	private _table: ID2UUID = Object.create(null);

	public constructor(readonly manager: AttributeManager, uuidList: string[]) {
		for (const uuid of uuidList) {
			const attribute = manager.get(uuid);
			if (attribute) {
				this._table[attribute.id] = uuid;
			}
		}
	}

	public property(id: string): Attribute | undefined {
		const uuid = this._table[id];

		return (uuid !== undefined ? this.manager.get(uuid) : undefined);
	}
}

export class AttributeEvaluator implements PropertyEvaluator {
	public constructor(readonly inputs: InputDataSet) { }

	public supports(property: Property): boolean {
		return (property instanceof AttributeBase);
	}

	public evaluate(property: Property, resolver: PropertyResolver): any {
		return (property instanceof AttributeBase ? property.evaluate(this.getInputData(property), resolver) : undefined);
	}

	public validate(property: Property, resolver: PropertyResolver, value: any): any {
		return (property instanceof AttributeBase ? property.validate(this.getInputData(property), resolver, value) : value);
	}

	private getInputData(property: Property): InputData {
		return this.inputs.get(property.id) || new InputData();
	}
}

function isFiniteOrString(x: any): boolean {
	return Number.isFinite(x) || typeof x === 'string';
}