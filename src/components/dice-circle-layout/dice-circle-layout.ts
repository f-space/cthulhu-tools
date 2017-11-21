import Vue from 'vue';
import DiceLayout from "@component/dice-layout";

export default DiceLayout.extend({
	name: "dice-circle-view",
	computed: {
		outerRadius(): number { return Math.min(this.width, this.height) / 2; },
		innerRadius(): number { return this.outerRadius / (1 + Math.sqrt(2 / (1 - Math.cos(Math.PI * 2 / this.groupCount)))); },
		positions(): { x: number, y: number }[] { return this.getPositions(); },
		style(): object { return { "--dice-size": `${this.innerRadius}px` }; },
	},
	methods: {
		getPositions() {
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
		},
	},
});