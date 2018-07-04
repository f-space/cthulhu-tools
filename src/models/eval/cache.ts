export interface Cache {
	has(key: string): boolean;
	get(key: string): any;
	set(key: string, value: any): void;
}

export interface CacheEntry {
	key: string;
	value: any;
	date: Date;
}