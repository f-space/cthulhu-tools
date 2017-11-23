import Vue from 'vue';
import { Component } from 'vue-property-decorator';

export interface DiceImageLayout {
	[type: string]: DiceSprite[];
}

export interface DiceSprite {
	x: number;
	y: number;
	w: number;
	h: number;
}

@Component
export default class AppResource extends Vue {
	public diceImage: HTMLImageElement | null = null;
	public diceImageLayout: DiceImageLayout | null = null;
	public diceSound: HTMLAudioElement | null = null;

	protected mounted(): void {
		this.diceImage = this.$refs.diceImage as HTMLImageElement;
		this.diceSound = this.$refs.diceSound as HTMLAudioElement;

		const url = this.diceImage.dataset.layout as string;
		fetch(url).then(response => {
			if (response.ok) {
				response.json().then(data => {
					this.diceImageLayout = data;
				});
			}
		});
	}
}