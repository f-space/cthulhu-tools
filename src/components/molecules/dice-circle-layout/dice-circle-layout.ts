import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DiceDisplay } from "models/dice";
import SizeMixin, { mixin } from "mixins/size";

type Position = { x: number, y: number };

@Component
export default class DiceCircleLayout extends mixin(Vue, SizeMixin) {
	@Prop({ required: true })
	public readonly display!: DiceDisplay[][];

	public get diceCount(): number { return this.display.length; }

	public get outerRadius(): number { return Math.min(this.width, this.height) / 2; }
	public get innerRadius(): number { return this.outerRadius / (1 + Math.sqrt(2 / (1 - Math.cos(Math.PI * 2 / this.diceCount)))); }
	public get diceSize(): number { return this.innerRadius; }
	public get positions(): Position[] { return this.getPositions(); }

	private getPositions(): Position[] {
		const count = this.diceCount;
		const radius = this.outerRadius - this.innerRadius;
		const centerX = this.width / 2;
		const centerY = this.height / 2;
		const omega = Math.PI * 2 / count;
		return Array.from(Array(count), (_, n) => {
			return {
				x: centerX + Math.sin(omega * n) * radius,
				y: centerY - Math.cos(omega * n) * radius,
			}
		});
	}
}