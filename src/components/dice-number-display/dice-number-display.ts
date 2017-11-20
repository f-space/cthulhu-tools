import Vue from 'vue';
import { DiceSet } from 'models/dice';

export default Vue.extend({
	name: "dice-number-display",
	props: {
		width: {
			type: Number,
			required: true,
			validator(value: number) { return Number.isFinite(value) && value >= 0; },
		},
		height: {
			type: Number,
			required: true,
			validator(value: number) { return Number.isFinite(value) && value >= 0; },
		},
		diceSet: {
			type: DiceSet,
			required: true,
		},
		values: {
			type: Array as { (): number[] },
			required: true,
		},
		critical: {
			type: Number,
			default: Infinity,
		},
		fumble: {
			type: Number,
			default: -Infinity,
		},
	},
	data() {
		return {
			font: "",
		};
	},
	computed: {
		empty(): boolean { return this.diceSet.size === 0; },
		value(): number { return this.values.reduce((sum, value) => sum += value, 0); },
		max(): number { return this.diceSet.dices.reduce((sum, dice) => sum += dice.max, 0); },
		type(): string { return this.value >= this.critical ? "critical" : this.value <= this.fumble ? "fumble" : ""; },
		fontSize(): number { return this.getFontSize(); },
		textAspectRatio(): number { return this.getTextAspectRatio(); },
		style(): object { return { "--font-size": `${this.fontSize}px` }; },
	},
	methods: {
		getFontSize() {
			const efficientHeight = this.height * 0.5;
			if (this.width / efficientHeight > this.textAspectRatio) {
				return efficientHeight;
			} else {
				return this.width / this.textAspectRatio;
			}
		},
		getTextAspectRatio() {
			const height = 100;
			const font = this.font.replace(/\d+px/, `${height}px`);
			const text = String(this.max);
			const width = this.measure(text, font);
			return (width / height);
		},
		measure(text: string, font: string) {
			const canvas = document.createElement('canvas');
			canvas.width = 0;
			canvas.height = 0;

			const context = canvas.getContext('2d') as CanvasRenderingContext2D;
			context.font = font;

			return context.measureText(text).width;
		},
	},
	mounted() {
		this.font = window.getComputedStyle(this.$el).font || "";
	},
});