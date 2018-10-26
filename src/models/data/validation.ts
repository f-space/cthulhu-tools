import { Reference, Expression } from "./expression";

const MIN_INT32 = (1 << 31);
const MAX_INT32 = (1 << 31) ^ -1;
const ID_PATTERN = /^[a-z_][0-9a-z_]*$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

export type Unknown = {} | null | undefined;

export function validate(name: string, value: any): Validation<Unknown> {
	return new Validation(name, value);
}

export class Validation<T> {
	public readonly name: string;
	public readonly value: T;

	public constructor(name: string, value: T) {
		this.name = name;
		this.value = value;
	}

	public any(this: Validation<Unknown>): Validation<any> {
		return this;
	}

	public int(this: Validation<Unknown>): Validation<number> {
		if (typeof this.value !== 'number') return this.error("int::type");
		if (!Number.isInteger(this.value)) return this.error("int::integer");
		if (this.value < MIN_INT32 || this.value > MAX_INT32) return this.error("int::i32");

		return this as Validation<number>;
	}

	public number(this: Validation<Unknown>): Validation<number> {
		if (typeof this.value !== 'number') return this.error("number:type");
		if (!Number.isFinite(this.value)) return this.error("number::finite");

		return this as Validation<number>;
	}

	public string(this: Validation<Unknown>): Validation<string> {
		if (typeof this.value !== 'string') return this.error("string::type");

		return this as Validation<string>;
	}

	public bool(this: Validation<Unknown>): Validation<boolean> {
		if (typeof this.value !== 'boolean') return this.error("bool::type");

		return this as Validation<boolean>;
	}

	public object<U extends object>(this: Validation<Unknown>): Validation<U> {
		if (typeof this.value !== 'object' || this.value === null) return this.error("object::type");

		return this as Validation<U>;
	}

	public enum<U>(this: Validation<Unknown>, set: Set<U>): Validation<U> {
		if (!set.has(this.value as any)) return this.error("enum::member");

		return this as Validation<U>;
	}

	public nullable<U>(this: Validation<Unknown>, map: (v: Validation<Unknown>) => Validation<U>): Validation<U | null> {
		return (this.value === null ? this as Validation<null> : map(this));
	}

	public optional<U>(this: Validation<Unknown>, map: (v: Validation<Unknown>) => Validation<U>): Validation<U | undefined> {
		return (this.value === undefined ? this as Validation<undefined> : map(this));
	}

	public array<U>(this: Validation<Unknown>, map: (v: Validation<Unknown>) => Validation<U>): Validation<U[]> {
		if (!Array.isArray(this.value)) return this.error("array::type");

		const name = this.name;
		const value = this.value.map((v, i) => map(new Validation(`${this.name}[${i}]`, v)).value);
		return new Validation(name, value);
	}

	public dict<U>(this: Validation<Unknown>, map: (v: Validation<{}>) => Validation<U>): Validation<Map<string, U>> {
		if (typeof this.value !== 'object' || this.value === null || Array.isArray(this.value)) return this.error("dict::type");

		const name = this.name;
		const value = new Map(Object.entries(this.value).map(([k, v]) => [k, map(new Validation(`${this.name}[${k}]`, v)).value] as [string, U]));
		return new Validation(name, value);
	}

	public time(this: Validation<Unknown>): Validation<number> {
		if (typeof this.value !== 'number') return this.error("time::type");
		if (!Number.isSafeInteger(this.value)) return this.error("time::integer");

		return this as Validation<number>;
	}

	public min(this: Validation<number>, min: number): Validation<number> {
		if (this.value < min) return this.error("min::");

		return this;
	}

	public max(this: Validation<number>, max: number): Validation<number> {
		if (this.value > max) return this.error("max::");

		return this;
	}

	public positive(this: Validation<number>): Validation<number> {
		if (this.value < Number.EPSILON) return this.error("positive::");

		return this;
	}

	public nonempty(this: Validation<string>): Validation<string> {
		if (this.value === "") return this.error("nonempty::");

		return this;
	}

	public id(this: Validation<string>): Validation<string> {
		if (!ID_PATTERN.test(this.value)) return this.error("id::format");

		return this;
	}

	public uuid(this: Validation<string>): Validation<string> {
		if (!UUID_PATTERN.test(this.value)) return this.error("uuid::format");

		return this;
	}

	public ref(this: Validation<string>): Validation<string> {
		const ref = Reference.parse(this.value);
		if (ref === null) return this.error("ref::format");

		return this;
	}

	public expr(this: Validation<string>): Validation<Expression> {
		const expr = Expression.parse(this.value);
		if (expr === null) return this.error("expr::format");

		const name = this.name;
		const value = expr;
		return new Validation(name, value);
	}

	public or<U>(this: Validation<U | undefined>, defaultValue: U): Validation<U> {
		const name = this.name;
		const value = this.value !== undefined ? this.value : defaultValue;
		return new Validation(name, value);
	}

	public map<U, V>(this: Validation<U>, map: (value: U) => V): Validation<V> {
		const name = this.name;
		const value = map(this.value);
		return new Validation(name, value);
	}

	public error(rule: string): never {
		throw new Error(`[${rule}] ${this.name}: ${JSON.stringify(this.value)}`);
	}
}