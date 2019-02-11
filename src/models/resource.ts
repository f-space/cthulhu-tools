import 'blueimp-canvas-to-blob';
import DICE_IMAGE_URL from "assets/image/dice.png";
import DICE_IMAGE_LAYOUT_URL from "assets/image/dice.json";
import DICE_SOUND_URL from "assets/audio/dice.wav";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface ResourceMap {
	json: any;
	text: string;
	arrayBuffer: ArrayBuffer;
	blob: Blob;
}

interface DiceImageLayout {
	readonly [type: string]: ReadonlyArray<DiceImageRect>;
}

interface DiceImageRect {
	readonly x: number;
	readonly y: number;
	readonly w: number;
	readonly h: number;
}

export namespace Resources {
	export async function load<K extends keyof ResourceMap>(url: string, type: K): Promise<ResourceMap[K]> {
		return await fetch(url).then(response => {
			if (response.ok) {
				return response[type]();
			} else {
				throw new Error(`${response.statusText}: ${url}`);
			}
		});
	}

	export function loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = (e) => reject(new Error((e as ErrorEvent).message));
			image.src = src;
		});
	}
}

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

export namespace DiceImageResource {
	let promise: Promise<Map<string, Blob[]>> | undefined;
	let store: Promise<DiceImageStore> | undefined;

	export function global(): Promise<DiceImageStore> {
		return store || (store = load());
	}

	export async function load(): Promise<OwnedDiceImageStore> {
		if (promise === undefined) {
			promise = async function () {
				const [image, layout] = await Promise.all([
					Resources.loadImage(DICE_IMAGE_URL),
					Resources.load(DICE_IMAGE_LAYOUT_URL, 'json'),
				]);

				return await renderAll(image, layout);
			}();
		}

		const blobs = await promise;

		return new OwnedDiceImageStore(blobs);
	}

	export function unload(): void {
		promise = undefined;
	}

	async function renderAll(image: HTMLImageElement, layout: DiceImageLayout): Promise<Map<string, Blob[]>> {
		const entries = await Promise.all(
			Object.entries(layout)
				.filter(([_, rects]) => Array.isArray(rects))
				.map(([type, rects]) =>
					Promise.all(rects.map(rect => render(image, rect)))
						.then(blobs => [type, blobs] as [string, Blob[]])
				)
		);

		return new Map(entries);
	}

	function render(image: HTMLImageElement, rect: DiceImageRect): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const x = Math.max(Math.min(rect.x, Number.MAX_SAFE_INTEGER), 0);
			const y = Math.max(Math.min(rect.y, Number.MAX_SAFE_INTEGER), 0);
			const w = Math.max(Math.min(rect.w, Number.MAX_SAFE_INTEGER), 0);
			const h = Math.max(Math.min(rect.h, Number.MAX_SAFE_INTEGER), 0);

			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;

			const context = canvas.getContext('2d');
			if (context) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(image, x, y, w, h, 0, 0, canvas.width, canvas.height);
			}

			canvas.toBlob(blob => {
				if (blob) {
					resolve(blob);
				} else {
					reject(new Error("Failed to convert a canvas to a blob."));
				}
			});
		});
	}
}

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

export namespace DiceSoundResource {
	let promise: Promise<Blob> | undefined;
	let store: Promise<DiceSoundStore> | undefined;

	export function global(): Promise<DiceSoundStore> {
		return store || (store = load());
	}

	export async function load(): Promise<OwnedDiceSoundStore> {
		if (promise === undefined) {
			promise = Resources.load(DICE_SOUND_URL, 'blob');
		}

		const blob = await promise;

		return new OwnedDiceSoundStore(blob);
	}

	export function unload(): void {
		promise = undefined;
	}
}