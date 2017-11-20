import Vue from 'vue';

export interface DiceImageLayout {
	[type: string]: DiceSprite[];
}

export interface DiceSprite {
	x: number;
	y: number;
	w: number;
	h: number;
}

export default Vue.extend({
	name: "resource-component",
	data() {
		return {
			diceImage: null as HTMLImageElement | null,
			diceImageLayout: null as DiceImageLayout | null,
			diceSound: null as HTMLAudioElement | null,
		};
	},
	methods: {
		requestJson(url: string) {
			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.responseType = 'json';
				xhr.open('GET', url);
				xhr.onload = () => {
					if (xhr.status === 200) {
						resolve(xhr.response);
					} else {
						reject(new Error(xhr.statusText));
					}
				};
				xhr.onerror = () => {
					reject(new Error(xhr.statusText));
				};
				xhr.send();
			});
		},
	},
	mounted() {
		this.diceImage = this.$refs.diceImage as HTMLImageElement;
		this.diceSound = this.$refs.diceSound as HTMLAudioElement;

		const url = this.diceImage.dataset.layout as string;
		this.requestJson(url).then(data => {
			this.diceImageLayout = data as DiceImageLayout;
		});
	},
});