enum StorageKey {
	Version = 'version',
	Muted = 'muted',
}

const DEFAULT_VALUE: { [key: string]: any } = {
	[StorageKey.Version]: 0,
	[StorageKey.Muted]: true,
};

const AVAILABLE = checkStorageAvailable();

export const VERSION = 1;

export function muted(): boolean;
export function muted(value: boolean): void;
export function muted(value?: boolean): boolean | void {
	checkVersion();

	if (value === undefined) {
		return get<boolean>(StorageKey.Muted);
	} else {
		set<boolean>(StorageKey.Muted, value);
	}
}

function checkStorageAvailable(): boolean {
	if (typeof localStorage !== undefined) {
		const CHECK = "___AVAILABILITY_CHECK___";
		try {
			localStorage.setItem(CHECK, CHECK);
			if (localStorage.getItem(CHECK) === CHECK) {
				localStorage.removeItem(CHECK);
				return true;
			}
		} catch (e) { }
	}
	return false;
}

function get<T>(key: StorageKey): T {
	if (AVAILABLE) {
		const value = localStorage.getItem(key);
		if (value !== null) {
			return JSON.parse(value);
		}
	}
	return DEFAULT_VALUE[key];
}

function set<T>(key: StorageKey, value: T): void {
	if (AVAILABLE) {
		localStorage.setItem(key, JSON.stringify(value));
	}
}

function checkVersion(): void {
	if (AVAILABLE) {
		const version = get<number>(StorageKey.Version);
		if (version < VERSION) {
			const stored = backup();
			try {
				upgrade(version);
				set<number>(StorageKey.Version, VERSION);
			} catch (e) {
				rollback(stored);
				throw e;
			}
		}
	}

	function backup(): Map<string, string> {
		const result = new Map<string, string>();
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i)!;
			const value = localStorage.getItem(key)!;
			result.set(key, value);
		}

		return result;
	}

	function rollback(data: Map<string, string>): void {
		localStorage.clear();
		for (const [key, value] of data) {
			localStorage.setItem(key, value);
		}
	}
}

function upgrade(from: number): void { }