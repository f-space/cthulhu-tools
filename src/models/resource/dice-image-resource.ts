import 'blueimp-canvas-to-blob';
import * as Resources from "./resource";
import { OwnedDiceImageStore, DiceImageStore } from "./dice-image-store";
import DICE_IMAGE_URL from "assets/image/dice.png";
import DICE_IMAGE_LAYOUT_URL from "assets/image/dice.json";

interface DiceImageLayout {
	readonly [type: string]: ReadonlyArray<DiceImageRect>;
}

interface DiceImageRect {
	readonly x: number;
	readonly y: number;
	readonly w: number;
	readonly h: number;
}

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