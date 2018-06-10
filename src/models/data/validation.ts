import { Expression } from "./expression";

const MIN_INT32 = (1 << 31);
const MAX_INT32 = (1 << 31) ^ -1;

export function int(value: number, min: number = MIN_INT32, max: number = MAX_INT32): number {
	return Math.max(Math.min(Math.trunc(value), max), min);
}

export function number(value: number, min: number = -Infinity, max: number = Infinity): number {
	return Math.max(Math.min(Number(value), max), min);
}

export function number_string(value: number | string | undefined): number | string | undefined {
	if (typeof value === 'number') return number(value);
	if (typeof value === 'string') return string(value);
	return undefined;
}

export function finite(value: number | undefined): number | undefined {
	return Number.isFinite(Number(value)) ? Number(value) : undefined;
}

export function positive(value: number | undefined): number | undefined {
	return Number(value) > Number.EPSILON ? Number(value) : undefined;
}

export function string(value: string): string {
	return String(value);
}

export function string_null(value: string | null | undefined): string | null {
	return (value != null ? String(value) : null);
}

export function string_enum<T extends string>(value: T): T {
	return String(value) as T;
}

export function boolean(value: boolean): boolean {
	return Boolean(value);
}

export function array<T, U>(value: ReadonlyArray<T> | undefined, map: (value: T) => U): U[] {
	return (value != null ? Array.from(value, map) : []);
}

export function table<T, U>(value: { readonly [key: string]: T } | undefined, map: (value: T) => U): { [key: string]: U } {
	if (typeof value === 'object' && value !== null) {
		return Object.entries(value).reduce((obj, [k, v]) => (obj[k] = map(v), obj), Object.create(null));
	} else {
		return Object.create(null);
	}
}

export function map<T, U = T>(value: { readonly [key: string]: T } | undefined, map?: (value: T) => U): Map<string, U> {
	if (typeof value === 'object' && value !== null) {
		if (map === undefined) {
			return new Map(Object.entries(value) as any);
		} else {
			return new Map(Object.entries(value).map(([k, v]) => [k, map(v)] as [string, U]));
		}
	} else {
		return new Map();
	}
}

export function time(value: number | undefined): number {
	return Number.isSafeInteger(value as number) ? value as number : Date.now();
}

export function uuid(value: string): string {
	return String(value);
}

export function expression(value: string): Expression {
	return Expression.parse(String(value)) || Expression.value(NaN);
}

export function or<T>(value: T | undefined, defaultValue: T): T {
	return (value !== undefined ? value : defaultValue);
}

export function opt<T, U>(value: T | undefined, map: (value: T) => U): U | undefined {
	return (value !== undefined ? map(value) : undefined);
}