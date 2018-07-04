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

export function throttle<T extends Function>(interval: number, fn: T): T {
	let id: any, last = -Infinity;
	return function (this: any): void {
		const elapsed = Date.now() - last;
		if (id === undefined && elapsed > interval) {
			fn.apply(this, arguments);
			last = Date.now();
		} else {
			clearTimeout(id);
			id = setTimeout(() => {
				fn.apply(this, arguments);
				last = Date.now();
				id = undefined;
			}, interval - elapsed);
		}
	} as any;
}

export function debounce<T extends Function>(delay: number, fn: T): T {
	let id: any;
	return function (this: any): void {
		clearTimeout(id);
		id = setTimeout(() => {
			fn.apply(this, arguments);
			id = undefined;
		}, delay);
	} as any;
}