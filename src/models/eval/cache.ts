import { deepClone, getFNV1a } from "models/utility";

export interface Cache {
	has(hash: string | null, id: string): boolean;
	get(hash: string | null, id: string): any;
	set(hash: string | null, id: string, value: any): void;
}

export interface ValueTable {
	[hash: string]: {
		[id: string]: any;
	}
}

export interface CacheEntry {
	key: number;
	state: string;
	hash: string;
	id: string;
	value: any;
	date: Date;
}

export interface CacheStorage {
	fetch(state: string): ValueTable;
	touch(entry: CacheEntry): void;
	set(entry: CacheEntry): void;
}

export class ObjectCache implements Cache {
	private readonly values: ValueTable;

	public constructor(values?: ValueTable) {
		this.values = values !== undefined ? deepClone(values) : Object.create(null);
	}

	public has(hash: string | null, id: string): boolean {
		return (hash = String(hash)), (hash in this.values && id in this.values[hash]);
	}

	public get(hash: string | null, id: string): any {
		return (hash = String(hash)), (hash in this.values ? this.values[hash][id] : undefined);
	}

	public set(hash: string | null, id: string, value: any): void {
		const c0 = this.values;
		const c1 = (hash = String(hash)) in c0 ? c0[hash] : (c0[hash] = Object.create(null));

		c1[id] = value;
	}
}

export class ExternalCache extends ObjectCache {
	public constructor(readonly storage: CacheStorage, readonly state: string) {
		super(storage.fetch(state));
	}

	public get(hash: string | null, id: string): any {
		const value = super.get(hash, id);
		if (value !== undefined) {
			const entry = this.createEntry(hash, id, value);
			this.storage.touch(entry);
		}

		return value;
	}

	public set(hash: string | null, id: string, value: any): void {
		if (value !== undefined) {
			const entry = this.createEntry(hash, id, value);
			this.storage.set(entry);
		}

		super.set(hash, id, value);
	}

	private createEntry(hash: string | null, id: string, value: any): CacheEntry {
		return {
			key: getFNV1a(this.state + hash + id),
			state: this.state,
			hash: String(hash),
			id: id,
			value: value,
			date: new Date(),
		};
	}
}