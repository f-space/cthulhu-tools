import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import DiceLayout from "@component/dice-layout";

type Position = { x: number, y: number };

@Component
export default class DiceCircleLayout extends DiceLayout {
	public get outerRadius(): number {
		return Math.min(this.width, this.height) / 2;
	}

	public get innerRadius(): number {
		return this.outerRadius / (1 + Math.sqrt(2 / (1 - Math.cos(Math.PI * 2 / this.groupCount))));
	}

	public get positions(): Position[] {
		return this.getPositions();
	}

	public get style(): object {
		return { "--dice-size": `${this.innerRadius}px` };
	}

	private getPositions(): Position[] {
		const count = this.groupCount;
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