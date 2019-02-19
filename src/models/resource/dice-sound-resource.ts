import * as Resources from "./resource";
import { OwnedDiceSoundStore, DiceSoundStore } from "./dice-sound-store";
import DICE_SOUND_URL from "assets/audio/dice.wav";

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