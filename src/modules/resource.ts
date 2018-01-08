import { DiceImage, DiceImageLayout } from "models/resource";
import { Module, Mutation, Action } from "modules/vuex-class-module"

@Module({ namespaced: true })
export default class ResourceModule {
	public diceImage: DiceImage | null = null;
	public diceSound: HTMLAudioElement | null = null;

	@Mutation
	public setDiceImage(image: DiceImage): void {
		this.diceImage = image;
	}

	@Mutation
	public setDiceSound(sound: HTMLAudioElement): void {
		this.diceSound = sound;
	}

	@Action
	public updateDiceImage(source: HTMLImageElement): void {
		const url = source.dataset.layout;
		if (url) {
			fetch(url).then(response => {
				if (response.ok) {
					response.json().then(data => {
						this.setDiceImage(new DiceImage(source, data));
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