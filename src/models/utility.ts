import sha256 from "fast-sha256";
import { encode } from "@stablelib/utf8";

export function deepClone<T>(value: T): T {
	return JSON.parse(JSON.stringify(value), (k, v) => {
		if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
			return Object.assign(Object.create(null), v);
		}
		return v;
	});
}

export function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
		const random = Math.random() * 16 | 0;
		const value = (ch === 'x' ? random : (random & 0x03 | 0x08));
		return value.toString(16);
	});
}

export function toHexString(bytes: Uint8Array): string {
	return Array.from(bytes).map(x => x.toString(16).padStart(2, "0")).join('');
}

export function getSHA256(data: string): string {
	return toHexString(sha256(encode(data)));
}

export function getFNV1a(data: string): number {
	let hash = 2166136261;
	for (let i = 0, len = data.length; i < len; i++) {
		const bytes = data.charCodeAt(i);
		hash ^= (bytes >>> 8);
		hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
		hash ^= (bytes & 0xff);
		hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
	}
	return (hash >>> 0);
}