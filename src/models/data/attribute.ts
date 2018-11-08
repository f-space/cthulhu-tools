import { Hash } from "./hash";
import { InputMethodData, InputMethod } from "./input";
import { Expression } from "./expression";
import { validate } from "./validation";

export enum AttributeType {
	Integer = 'integer',
	Number = 'number',
	Text = 'text',
}

export type AttributeData = IntegerAttributeData | NumberAttributeData | TextAttributeData;
export type Attribute = IntegerAttribute | NumberAttribute | TextAttribute;

interface AttributeCommonData<T extends AttributeType> {
	readonly type: T;
	readonly uuid: string;
	readonly id: string;
	readonly name: string;
	readonly inputs?: ReadonlyArray<InputMethodData>;
	readonly view?: boolean;
	readonly hidden?: boolean;
}

export interface IntegerAttributeData extends AttributeCommonData<AttributeType.Integer> {
	readonly expression: string;
	readonly min?: string;
	readonly max?: string;
}

export interface NumberAttributeData extends AttributeCommonData<AttributeType.Number> {
	readonly expression: string;
	readonly min?: string;
	readonly max?: string;
}

export interface TextAttributeData extends AttributeCommonData<AttributeType.Text> {
	readonly expression: string;
}

interface AttributeCommonConfig {
	readonly uuid: string;
	readonly id: string;
	readonly name: string;
	readonly inputs?: ReadonlyArray<InputMethod>;
	readonly view?: boolean;
	readonly hidden?: boolean;
}

export interface IntegerAttributeConfig extends AttributeCommonConfig {
	readonly expression: Expression;
	readonly min?: Expression;
	readonly max?: Expression;
}

export interface NumberAttributeConfig extends AttributeCommonConfig {
	readonly expression: Expression;
	readonly min?: Expression;
	readonly max?: Expression;
}

export interface TextAttributeConfig extends AttributeCommonConfig {
	readonly expression: Expression;
}

abstract class AttributeBase<T extends AttributeType> implements AttributeCommonConfig {
	public readonly uuid: string;
	public readonly id: string;
	public readonly name: string;
	public readonly inputs: ReadonlyArray<InputMethod>;
	public readonly view: boolean;
	public readonly hidden: boolean;
	public readonly readonly: boolean;

	public abstract get type(): T;

	public get hash(): string { return Hash.get(this).hex; }

	public constructor({ uuid, id, name, inputs, view, hidden }: AttributeCommonConfig, readonly?: boolean) {
		this.uuid = uuid;
		this.id = id;
		this.name = name;
		this.inputs = inputs !== undefined ? inputs : [];
		this.view = Boolean(view);
		this.hidden = Boolean(hidden);
		this.readonly = Boolean(readonly);
	}

	public toJSON(): AttributeCommonData<T> {
		return {
			type: this.type,
			uuid: this.uuid,
			id: this.id,
			name: this.name,
			inputs: this.inputs.length !== 0 ? this.inputs.map(input => input.toJSON()) : undefined,
			view: this.view || undefined,
			hidden: this.hidden || undefined,
		};
	}

	protected static import({ uuid, id, name, inputs, view, hidden }: AttributeCommonData<AttributeType>): AttributeCommonConfig {
		return {
			uuid: validate("uuid", uuid).string().uuid().value,
			id: validate("id", id).string().id().value,
			name: validate("name", name).string().nonempty().value,
			inputs: validate("inputs", inputs).optional(v => v.array(v => v.object<InputMethodData>().map(InputMethod.from))).value,
			view: validate("view", view).optional(v => v.bool()).value,
			hidden: validate("hidden", hidden).optional(v => v.bool()).value,
		};
	}

	protected config(): AttributeCommonConfig {
		const { uuid, id, name, inputs, view, hidden } = this;

		return { uuid, id, name, inputs, view, hidden };
	}
}

export class IntegerAttribute extends AttributeBase<AttributeType.Integer> implements IntegerAttributeConfig {
	public readonly expression: Expression;
	public readonly min?: Expression;
	public readonly max?: Expression;

	public get type(): AttributeType.Integer { return AttributeType.Integer; }

	public constructor({ expression, min, max, ...rest }: IntegerAttributeConfig, readonly?: boolean) {
		super(rest, readonly);

		this.expression = expression;
		this.min = min;
		this.max = max;
	}

	public static from(data: IntegerAttributeData, readonly?: boolean): IntegerAttribute {
		return new IntegerAttribute(this.import(data), readonly);
	}

	public toJSON(): IntegerAttributeData {
		return Object.assign(super.toJSON(), {
			expression: this.expression.toJSON(),
			min: this.min && this.min.toJSON(),
			max: this.max && this.max.toJSON(),
		});
	}

	public set(config: Partial<IntegerAttributeConfig>, readonly?: boolean): IntegerAttribute {
		return new IntegerAttribute(Object.assign(this.config(), config), readonly);
	}

	protected static import({ expression, min, max, ...rest }: IntegerAttributeData): IntegerAttributeConfig {
		return Object.assign(super.import(rest), {
			expression: validate("expression", expression).string().expr().value,
			min: validate("min", min).optional(v => v.string().expr()).value,
			max: validate("max", max).optional(v => v.string().expr()).value,
		});
	}

	protected config(): IntegerAttributeConfig {
		const { expression, min, max } = this;

		return Object.assign(super.config(), { expression, min, max });
	}
}

export class NumberAttribute extends AttributeBase<AttributeType.Number> implements NumberAttributeConfig {
	public readonly expression: Expression;
	public readonly min?: Expression;
	public readonly max?: Expression;

	public get type(): AttributeType.Number { return AttributeType.Number; }

	public constructor({ expression, min, max, ...rest }: NumberAttributeConfig, readonly?: boolean) {
		super(rest, readonly);

		this.expression = expression;
		this.min = min;
		this.max = max;
	}

	public static from(data: NumberAttributeData, readonly?: boolean): NumberAttribute {
		return new NumberAttribute(this.import(data), readonly);
	}

	public toJSON(): NumberAttributeData {
		return Object.assign(super.toJSON(), {
			expression: this.expression.toJSON(),
			min: this.min && this.min.toJSON(),
			max: this.max && this.max.toJSON(),
		});
	}

	public set(config: Partial<NumberAttributeConfig>, readonly?: boolean): NumberAttribute {
		return new NumberAttribute(Object.assign(this.config(), config), readonly);
	}

	protected static import({ expression, min, max, ...rest }: NumberAttributeData): NumberAttributeConfig {
		return Object.assign(super.import(rest), {
			expression: validate("expression", expression).string().expr().value,
			min: validate("min", min).optional(v => v.string().expr()).value,
			max: validate("max", max).optional(v => v.string().expr()).value,
		});
	}

	protected config(): NumberAttributeConfig {
		const { expression, min, max } = this;

		return Object.assign(super.config(), { expression, min, max });
	}
}

export class TextAttribute extends AttributeBase<AttributeType.Text> implements TextAttributeConfig {
	public readonly expression: Expression;

	public get type(): AttributeType.Text { return AttributeType.Text; }

	public constructor({ expression, ...rest }: TextAttributeConfig, readonly?: boolean) {
		super(rest, readonly);

		this.expression = expression;
	}

	public static from(data: TextAttributeData, readonly?: boolean): TextAttribute {
		return new TextAttribute(this.import(data), readonly);
	}

	public toJSON(): TextAttributeData {
		return Object.assign(super.toJSON(), {
			expression: this.expression.toJSON(),
		});
	}

	public set(config: Partial<TextAttributeConfig>, readonly?: boolean): TextAttribute {
		return new TextAttribute(Object.assign(this.config(), config), readonly);
	}

	protected static import({ expression, ...rest }: TextAttributeData): TextAttributeConfig {
		return Object.assign(super.import(rest), {
			expression: validate("expression", expression).string().expr().value,
		});
	}

	protected config(): TextAttributeConfig {
		const { expression } = this;

		return Object.assign(super.config(), { expression });
	}
}

export namespace Attribute {
	export function from(data: AttributeData, readonly?: boolean): Attribute {
		switch (data.type) {
			case AttributeType.Integer: return IntegerAttribute.from(data, readonly);
			case AttributeType.Number: return NumberAttribute.from(data, readonly);
			case AttributeType.Text: return TextAttribute.from(data, readonly);
			default: throw new Error(`Invalid attribute type: ${(data as any).type}`);
		}
	}

	export function is(value: unknown): value is Attribute {
		return value instanceof AttributeBase;
	}
}
