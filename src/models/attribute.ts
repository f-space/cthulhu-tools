import { InputMethodData, InputMethod } from "models/input";
import * as validation from "models/validation";

export * from "models/input";

type AttributeType = 'integer' | 'number' | 'text';

interface AttributeDataMap {
	'integer': IntegerAttributeData;
	'number': NumberAttributeData;
	'text': TextAttributeData;
}

interface AttributeMap {
	'integer': IntegerAttribute;
	'number': NumberAttribute;
	'text': TextAttribute;
}

export type AttributeData = AttributeDataMap[AttributeType];
export type Attribute = AttributeMap[AttributeType];

interface AttributeDataBase<T extends AttributeType> {
	readonly type: T;
	readonly uuid?: string;
	readonly id: string;
	readonly name: string;
	readonly dependencies?: ReadonlyArray<string>;
	readonly inputs?: ReadonlyArray<InputMethodData>;
	readonly expression: string;
	readonly view?: boolean;
	readonly hidden?: boolean;
}

export interface IntegerAttributeData extends AttributeDataBase<'integer'> {
	readonly min?: number | string;
	readonly max?: number | string;
}

export interface NumberAttributeData extends AttributeDataBase<'number'> {
	readonly min?: number | string;
	readonly max?: number | string;
}

export interface TextAttributeData extends AttributeDataBase<'text'> { }

abstract class AttributeBase<T extends AttributeType> implements AttributeDataBase<T>{
	public readonly type: T;
	public readonly uuid: string;
	public readonly id: string;
	public readonly name: string;
	public readonly dependencies: ReadonlyArray<string>;
	public readonly inputs: ReadonlyArray<InputMethod>;
	public readonly expression: string;
	public readonly view: boolean;
	public readonly hidden: boolean;
	public readonly readonly: boolean;

	public constructor({ type, uuid, id, name, dependencies, inputs, expression, view, hidden }: AttributeDataBase<T>, readonly?: boolean) {
		this.type = validation.string_literal(type);
		this.uuid = validation.uuid(uuid);
		this.id = validation.string(id);
		this.name = validation.string(name);
		this.dependencies = validation.array(dependencies, validation.string);
		this.inputs = validation.array(inputs, InputMethod.from);
		this.expression = validation.string(expression);
		this.view = validation.boolean(validation.or(view, false));
		this.hidden = validation.boolean(validation.or(hidden, false));
		this.readonly = Boolean(readonly);
	}

	public toJSON(): AttributeDataBase<T> {
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
}

export class IntegerAttribute extends AttributeBase<'integer'> implements IntegerAttributeData {
	public readonly min?: number | string;
	public readonly max?: number | string;

	public constructor({ min, max, ...rest }: IntegerAttributeData, readonly?: boolean) {
		super(rest, readonly);

		this.min = validation.int_string(min);
		this.max = validation.int_string(max);
	}

	public toJSON(): IntegerAttributeData {
		return Object.assign(super.toJSON(), {
			min: this.min,
			max: this.max,
		});
	}
}

export class NumberAttribute extends AttributeBase<'number'> implements NumberAttributeData {
	public readonly min?: number | string;
	public readonly max?: number | string;

	public constructor({ min, max, ...rest }: NumberAttributeData, readonly?: boolean) {
		super(rest, readonly);

		this.min = validation.number_string(min);
		this.max = validation.number_string(max);
	}

	public toJSON(): NumberAttributeData {
		return Object.assign(super.toJSON(), {
			min: this.min,
			max: this.max,
		});
	}
}

export class TextAttribute extends AttributeBase<'text'> implements TextAttributeData {
	public constructor({ ...rest }: TextAttributeData, readonly?: boolean) {
		super(rest, readonly);
	}

	public toJSON(): TextAttributeData {
		return super.toJSON();
	}
}

export namespace Attribute {
	export function from(data: any, readonly?: boolean): Attribute {
		switch (data.type) {
			case 'integer': return new IntegerAttribute(data, readonly);
			case 'number': return new NumberAttribute(data, readonly);
			case 'text': return new TextAttribute(data, readonly);
			default: throw new Error(`Invalid attribute type: ${data.type}`);
		}
	}
}
