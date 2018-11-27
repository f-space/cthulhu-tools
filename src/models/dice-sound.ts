import { DiceSoundResource } from "models/resource";

export class DiceSoundPlayer {
	private element: HTMLAudioElement = document.createElement('audio');

	public get muted(): boolean { return this.element.muted; }
	public set muted(value: boolean) { this.element.muted = value; }
	public get paused(): boolean { return this.element.paused; }

	public constructor(autoLoad?: boolean) {
		if (autoLoad) this.load();
	}

	public async load(): Promise<void> {
		const store = await DiceSoundResource.global();

		await new Promise<void>((resolve, reject) => {
			this.element.oncanplaythrough = () => resolve();
			this.element.onerror = (e) => reject(new Error(e.message));
			this.element.preload = 'auto';
			this.element.src = store.get();
		});
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