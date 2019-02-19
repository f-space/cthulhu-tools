type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export class OwnedDiceImageStore {
	private readonly urls = new Map<Blob, string>();

	public constructor(private readonly blobs: ReadonlyMap<string, ReadonlyArray<Blob>>) { }

	public get(type: string, face: number): string {
		const faces = this.blobs.get(type);
		const blob = faces && faces[face];
		if (blob) {
			const cache = this.urls.get(blob);
			if (cache === undefined) {
				const url = URL.createObjectURL(blob);
				this.urls.set(blob, url);

				return url;
			}

			return cache;
		}

		return "";
	}

	public dispose(): void {
		for (const url of this.urls.values()) {
			URL.revokeObjectURL(url);
		}
		this.urls.clear();
	}
}

export type DiceImageStore = Omit<OwnedDiceImageStore, 'dispose'>;