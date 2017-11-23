import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DiceSet } from 'models/dice';

@Component
export default class DiceNumberDisplay extends Vue {
	@Prop({
		required: true,
		validator(value: number) { return Number.isFinite(value) && value >= 0; },
	})
	public width: number;

	@Prop({
		required: true,
		validator(value: number) { return Number.isFinite(value) && value >= 0; },
	})
	public height: number;

	@Prop({ required: true })
	public diceSet: DiceSet;

	@Prop({ required: true })
	public values: number[]

	@Prop({ default: Infinity })
	public critical: number;

	@Prop({ default: -Infinity })
	public fumble: number;

	private font: string = "";

	public get empty(): boolean {
		return this.diceSet.size === 0;
	}

	public get value(): number {
		return this.values.reduce((sum, value) => sum += value, 0);
	}

	public get max(): number {
		return this.diceSet.dices.reduce((sum, dice) => sum += dice.max, 0);
	}

	public get type(): string {
		return this.value >= this.critical ? "critical" : this.value <= this.fumble ? "fumble" : "";
	}

	public get textAspectRatio(): number {
		return this.getTextAspectRatio();
	}

	public get fontSize(): number {
		return this.getFontSize();
	}

	public get style(): object {
		return { "--font-size": `${this.fontSize}px` };
	}

	protected mounted(): void {
		this.font = window.getComputedStyle(this.$el).font || "";
	}

	private getFontSize(): number {
		const efficientHeight = this.height * 0.5;
		if (this.width / efficientHeight > this.textAspectRatio) {
			return efficientHeight;
		} else {
			return this.width / this.textAspectRatio;
		}
	}

	private getTextAspectRatio(): number {
		const height = 100;
		const font = this.font.replace(/\d+px/, `${height}px`);
		const text = String(this.max);
		const width = this.measure(text, font);
		return (width / height);
	}

	private measure(text: string, font: string) {
		const canvas = document.createElement('canvas');
		canvas.width = 0;
		canvas.height = 0;

		const context = canvas.getContext('2d') as CanvasRenderingContext2D;
		context.font = font;

		return context.measureText(text).width;
	}
}