export function generateUUID(): string {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
		const random = Math.random() * 16 | 0;
		const value = (ch === 'x' ? random : (random & 0x03 | 0x08));
		return value.toString(16);
	});
}

export function throttle<T extends Function>(interval: number, fn: T): T {
	let id: any, last = -Infinity;
	return function (this: any, ...args: any[]): void {
		const elapsed = Date.now() - last;
		if (id === undefined && elapsed > interval) {
			fn.apply(this, args);
			last = Date.now();
		} else {
			clearTimeout(id);
			id = setTimeout(() => {
				fn.apply(this, args);
				last = Date.now();
				id = undefined;
			}, interval - elapsed);
		}
	} as any;
}

export function debounce<T extends Function>(delay: number, fn: T): T {
	let id: any;
	return function (this: any, ...args: any[]): void {
		clearTimeout(id);
		id = setTimeout(() => {
			fn.apply(this, args);
			id = undefined;
		}, delay);
	} as any;
}