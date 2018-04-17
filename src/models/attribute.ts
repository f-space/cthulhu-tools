import { InputMethodData, InputMethod } from "models/input";
import { Expression, Format } from "models/expression";
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
	readonly inputs?: ReadonlyArray<InputMethodData>;
	readonly view?: boolean;
	readonly hidden?: boolean;
}

export interface IntegerAttributeData extends AttributeDataBase<'integer'> {
	readonly expression: number | string;
	readonly min?: number | string;
	readonly max?: number | string;
}

export interface NumberAttributeData extends AttributeDataBase<'number'> {
	readonly expression: number | string;
	readonly min?: number | string;
	readonly max?: number | string;
}

export interface TextAttributeData extends AttributeDataBase<'text'> {
	readonly format: string;
}

abstract class AttributeBase<T extends AttributeType> {
	public readonly type: T;
	public readonly uuid: string;
	public readonly id: string;
	public readonly name: string;
	public readonly inputs: ReadonlyArray<InputMethod>;
	public readonly view: boolean;
	public readonly hidden: boolean;
	public readonly readonly: boolean;

	public constructor({ type, uuid, id, name, inputs, view, hidden }: AttributeDataBase<T>, readonly?: boolean) {
		this.type = validation.string_enum(type);
		this.uuid = validation.uuid(uuid);
		this.id = validation.string(id);
		this.name = validation.string(name);
		this.inputs = validation.array(inputs, InputMethod.from);
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
			inputs: this.inputs,
			view: this.view || undefined,
			hidden: this.hidden || undefined,
		};
	}
}

export class IntegerAttribute extends AttributeBase<'integer'> {
	public readonly expression: Expression;
	public readonly min?: Expression;
	public readonly max?: Expression;

	public constructor({ expression, min, max, ...rest }: IntegerAttributeData, readonly?: boolean) {
		super(rest, readonly);

		this.expression = validation.expression(expression);
		this.min = validation.opt(min, validation.expression);
		this.max = validation.opt(max, validation.expression);
	}

	public toJSON(): IntegerAttributeData {
		return Object.assign(super.toJSON(), {
			expression: this.expression.toJSON(),
			min: this.min && this.min.toJSON(),
			max: this.max && this.max.toJSON(),
		});
	}
}

export class NumberAttribute extends AttributeBase<'number'> {
	public readonly expression: Expression;
	public readonly min?: Expression;
	public readonly max?: Expression;

	public constructor({ expression, min, max, ...rest }: NumberAttributeData, readonly?: boolean) {
		super(rest, readonly);

		this.expression = validation.expression(expression);
		this.min = validation.opt(min, validation.expression);
		this.max = validation.opt(max, validation.expression);
	}

	public toJSON(): NumberAttributeData {
		return Object.assign(super.toJSON(), {
			expression: this.expression.toJSON(),
			min: this.min && this.min.toJSON(),
			max: this.max && this.max.toJSON(),
		});
	}
}

export class TextAttribute extends AttributeBase<'text'> {
	public readonly format: Format;

	public constructor({ format, ...rest }: TextAttributeData, readonly?: boolean) {
		super(rest, readonly);

		this.format = validation.format(format);
	}

	public toJSON(): TextAttributeData {
		return Object.assign(super.toJSON(), {
			format: this.format.toJSON(),
		});
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
