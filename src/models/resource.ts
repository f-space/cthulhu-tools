import 'blueimp-canvas-to-blob';
import DICE_IMAGE_URL from "assets/image/dice.png";
import DICE_IMAGE_LAYOUT_URL from "assets/image/dice.json";
import DICE_SOUND_URL from "assets/audio/dice.wav";

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
}

export class DiceImageManager {
	private static state?: boolean;
	private static loader?: Promise<void>;
	private static images: { [type: string]: string[] } = Object.create(null);

	public static get complete(): boolean { return Boolean(this.state); }

	public static async load(): Promise<void> {
		if (this.loader === undefined) {
			this.loader = Promise.all([
				Resources.load(DICE_IMAGE_URL, 'blob').then(this.loadImage),
				Resources.load(DICE_IMAGE_LAYOUT_URL, 'json'),
			]).then(async ([image, layout]) => {
				await this.renderAll(image, layout);
				this.state = true;
			});
		}

		await this.loader;
	}

	public static async unload(): Promise<void> {
		if (this.loader !== undefined) {
			await this.loader.then(() => {
				for (const faces of Object.values(this.images)) {
					for (const image of faces) {
						URL.revokeObjectURL(image);
					}
				}
				delete this.state;
				delete this.loader;
			});
		}
	}

	public static get(type: string, face: number): string {
		return (type in this.images && this.images[type][face]) || "";
	}

	private static loadImage(this: void, blob: Blob): Promise<HTMLImageElement> {
		const url = URL.createObjectURL(blob);
		return new Promise<HTMLImageElement>((resolve, reject) => {
			const image = document.createElement('img');
			image.onload = () => resolve(image);
			image.onerror = (e) => reject(new Error(e.message));
			image.src = url;
		}).then(image => {
			URL.revokeObjectURL(url);
			return image;
		}).catch(error => {
			URL.revokeObjectURL(url);
			throw error;
		});
	}

	private static async renderAll(image: HTMLImageElement, layout: DiceImageLayout): Promise<void> {
		const tasks = [];
		for (const [type, rects] of Object.entries(layout)) {
			if (Array.isArray(rects)) {
				this.images[type] = rects.map(() => "");

				for (const [face, rect] of rects.entries()) {
					if (typeof rect === 'object' && rect !== null) {
						const task = this.render(image, rect).then(url => {
							this.images[type][face] = url;
						});
						tasks.push(task);
					}
				}
			}
		}

		await Promise.all(tasks);
	}

	private static render(image: HTMLImageElement, rect: DiceImageRect): Promise<string> {
		return new Promise(resolve => {
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

			canvas.toBlob(blob => { resolve(blob ? URL.createObjectURL(blob) : "") });
		});
	}
}

export class DiceSoundManager {
	private static state?: boolean;
	private static loader?: Promise<void>
	private static sound: string = "";

	public static get complete(): boolean { return Boolean(this.state); }

	public static async load(): Promise<void> {
		if (this.loader === undefined) {
			this.loader = Resources.load(DICE_SOUND_URL, 'blob').then(blob => {
				this.sound = URL.createObjectURL(blob);
				this.state = true;
			});
		}

		await this.loader;
	}

	public static async unload(): Promise<void> {
		if (this.loader !== undefined) {
			await this.loader.then(() => {
				URL.revokeObjectURL(this.sound);
				delete this.state;
				delete this.loader;
			});
		}
	}

	public static get(): string { return this.sound; }
}