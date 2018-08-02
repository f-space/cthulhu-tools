import { DiceSoundManager } from "models/resource";

export interface DiceSoundPlayer {
	readonly playing: boolean;
	play(): void;
	pause(): void;
}

export class DOMDiceSoundPlayer implements DiceSoundPlayer {
	private element?: HTMLAudioElement;

	public get playing(): boolean { return Boolean(this.element && !this.element.paused); }

	public constructor(autoLoad?: boolean) {
		if (autoLoad) this.load();
	}

	public async load(): Promise<void> {
		await DiceSoundManager.load();

		this.element = await DiceSoundManager.player();
	}

	public play(): void {
		if (this.element) {
			this.element.pause();
			this.element.currentTime = 0;
			this.element.play();
		}
	}

	public pause(): void {
		if (this.element) {
			this.element.pause();
		}
	}
}

export class MuteDiceSoundPlayer implements DiceSoundPlayer {
	public get playing(): boolean { return false; }
	public play(): void { }
	public pause(): void { }
}