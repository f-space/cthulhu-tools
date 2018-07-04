import Dexie from 'dexie';
import { Cache, CacheEntry } from "models/eval";
import { debounce } from "models/utility";

const SAVE_DELAY_TIME = 1000;
const MAX_CACHE_SIZE = 10000;

export class StatusCacheDatabase extends Dexie {
	public readonly entries!: Dexie.Table<CacheEntry, number>;

	public constructor() {
		super("status-cache");

		this.version(1).stores({
			entries: "key, date",
		})
	}
}

export class IDBCache implements Cache {
	private db: StatusCacheDatabase = new StatusCacheDatabase();
	private queue: CacheEntry[] = [];
	private requestSave = debounce(SAVE_DELAY_TIME, this.save);

	public constructor(readonly cache: Cache = new Map()) { }

	public has(key: string): boolean {
		return this.cache.has(key);
	}

	public get(key: string): any {
		const value = this.cache.get(key);
		if (value !== undefined) {
			this.queue.push({ key, value, date: new Date() });
			this.requestSave();
		}

		return value;
	}

	public set(key: string, value: any): void {
		if (value !== undefined) {
			this.queue.push({ key, value, date: new Date() });
			this.requestSave();
		}

		this.cache.set(key, value);
	}

	public async save(): Promise<void> {
		const entries = this.queue;
		this.queue = [];

		await this.db.transaction("rw", this.db.entries, () => {
			return this.db.entries.bulkPut(entries).then(() => {
				return this.db.entries.count();
			}).then((n): any => {
				if (n > MAX_CACHE_SIZE) {
					const excess = MAX_CACHE_SIZE - n;
					return this.db.entries.orderBy("date").limit(excess).delete();
				}
			});
		});
	}

	public async load(): Promise<void> {
		await this.db.transaction("r", this.db.entries, () => {
			return this.db.entries.toArray();
		}).then(entries => {
			for (const entry of entries) {
				this.cache.set(entry.key, entry.value);
			}
		});
	}
}

export default new IDBCache();