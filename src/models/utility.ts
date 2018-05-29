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

export function throttle<T extends (...args: any[]) => void>(interval: number, fn: T): T {
	let id = undefined as number | undefined;
	let last = -Infinity;

	function wrapper(this: any, ...args: any[]): void {
		const elapsed = performance.now() - last;
		const exec = () => {
			id = undefined;
			last = performance.now();
			fn.apply(this, args);
		}

		clearTimeout(id);
		if (elapsed > interval) {
			exec();
		} else {
			id = setTimeout(exec, interval - elapsed) as any;
		}
	}

	return wrapper as T;
}