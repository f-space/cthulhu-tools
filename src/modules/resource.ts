import { Module, Mutation, Action } from "modules/vuex-class-module"

export interface DiceImageLayout {
	[type: string]: DiceSprite[];
}

export interface DiceSprite {
	x: number;
	y: number;
	w: number;
	h: number;
}

@Module({ namespaced: true })
export default class ResourceModule {
	public diceImage: HTMLImageElement | null = null;
	public diceImageLayout: DiceImageLayout | null = null;
	public diceSound: HTMLAudioElement | null = null;

	@Mutation
	public setDiceImage(image: HTMLImageElement, layout: DiceImageLayout): void {
		this.diceImage = image;
		this.diceImageLayout = layout;
	}

	@Mutation
	public setDiceSound(sound: HTMLAudioElement): void {
		this.diceSound = sound;
	}

	@Action
	public updateDiceImage(image: HTMLImageElement): void {
		const url = image.dataset.layout;
		if (url) {
			fetch(url).then(response => {
				if (response.ok) {
					response.json().then(data => {
						this.setDiceImage(image, data);
					});
				}
			});
		}
	}

	@Action
	public updateDiceSound(sound: HTMLAudioElement): void {
		this.setDiceSound(sound);
	}
}