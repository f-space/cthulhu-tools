type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export class OwnedDiceSoundStore {
	private url?: string;

	public constructor(private readonly blob: Blob) { }

	public get(): string {
		if (this.url === undefined) {
			this.url = URL.createObjectURL(this.blob);
		}

		return this.url;
	}

	public dispose(): void {
		if (this.url !== undefined) {
			URL.revokeObjectURL(this.url);
			this.url = undefined;
		}
	}
}

export type DiceSoundStore = Omit<OwnedDiceSoundStore, 'dispose'>;