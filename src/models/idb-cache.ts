import DB from "models/storage";
import { ValueTable, CacheEntry, CacheStorage } from "models/cache";

const SAVE_DELAY_TIME = 1000;
const MAX_CACHE_SIZE = 1000;

function sleep(time: number): Promise<void> {
	return new Promise(resolve => { setTimeout(resolve, time); });
}

export class IDBCacheStorage implements CacheStorage {
	private table: { [state: string]: ValueTable } = Object.create(null);
	private queue: CacheEntry[] = [];
	private saveTask: Promise<void> | null = null;

	public fetch(state: string) {
		return this.table[state];
	}

	public touch(entry: CacheEntry, dontSave?: boolean): void {
		this.putEntry(entry);

		if (!dontSave) this.requestSave();
	}

	public set(entry: CacheEntry, dontSave?: boolean): void {
		this.putEntry(entry);
		this.putValue(entry);

		if (!dontSave) this.requestSave();
	}

	public async requestSave(delay: number = SAVE_DELAY_TIME): Promise<void> {
		if (this.saveTask === null) {
			this.saveTask = sleep(delay).then(() => {
				this.saveTask = null;
				return this.save();
			});
		}

		await this.saveTask;
	}

	public async save(): Promise<void> {
		const entries = this.queue;
		this.queue = [];

		await DB.transaction("rw", DB.caches, () => {
			return DB.caches.bulkPut(entries).then(() => {
				return DB.caches.count();
			}).then((n): any => {
				if (n > MAX_CACHE_SIZE) {
					const excess = MAX_CACHE_SIZE - n;
					return DB.caches.orderBy("date").limit(excess).delete();
				}
			});
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.caches, () => {
			return DB.caches.orderBy("date").toArray();
		}).then(entries => {
			for (const entry of entries) {
				this.putValue(entry);
			}
		});
	}

	private putEntry(entry: CacheEntry): void {
		this.queue.push(entry);
	}

	private putValue(entry: CacheEntry): void {
		const c0 = this.table;
		const c1 = c0[entry.state] || (c0[entry.state] = Object.create(null));
		const c2 = c1[entry.hash] || (c1[entry.hash] = Object.create(null));

		c2[entry.id] = entry.value;
	}
}

export default new IDBCacheStorage();