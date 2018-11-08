import murmur128 from "murmur-128";

export class Hash {
	private static cache: WeakMap<object, Hash> = new WeakMap();

	private _hex?: string;

	public get bytes(): Uint8Array {
		return new Uint8Array(this.buffer);
	}

	public get hex(): string {
		return this._hex || (this._hex = Array.from(this.bytes).map(x => x.toString(16).padStart(2, "0")).join(''));
	}

	private constructor(readonly buffer: ArrayBuffer) { }

	public static from(data: ArrayBuffer | string): Hash {
		return new Hash(murmur128(data));
	}

	public static get<T extends object>(data: T, map: (src: T) => ArrayBuffer | string = this.stringify): Hash {
		const cached = this.cache.get(data);
		if (cached === undefined) {
			const value = this.from(map(data));
			this.cache.set(data, value);
			return value;
		}
		return cached;
	}

	public static stringify(data: any): string {
		const seen = new Set();

		return (function recurse(node: any): string {
			if (typeof node !== 'object' || node === null) {
				return JSON.stringify(node);
			}

			if (typeof node.toJSON === 'function') {
				node = node.toJSON();
			}

			if (seen.has(node)) {
				throw new TypeError("Converting circular structure to JSON");
			}

			seen.add(node);

			let result;
			if (Array.isArray(node)) {
				const items = node.map(item => {
					const value = recurse(item);
					return value !== undefined ? value : 'null';
				}).join();

				result = `[${items}]`;
			} else {
				const props = Object.keys(node).sort().reduce((props, key) => {
					const value = recurse(node[key]);
					if (value !== undefined) {
						props.push(`"${key}":${value}`);
					}
					return props;
				}, [] as string[]).join();

				result = `{${props}}`;
			}

			seen.delete(node);

			return result;
		})(data);
	}
}