import Vue from 'vue';
import ResizeEvent from "mixins/resize-event";
import DiceRoll from "components/dice-roll/dice-roll";
import DiceRowLayout from "components/dice-row-layout/dice-row-layout.vue";
import DiceCircleLayout from "components/dice-circle-layout/dice-circle-layout.vue";
import DiceFlowLayout from "components/dice-flow-layout/dice-flow-layout.vue";
import DiceImage from "components/dice-image/dice-image.vue";
import DiceNumberDisplay from "components/dice-number-display/dice-number-display.vue";

export default DiceRoll.extend({
	name: "dice-view",
	mixins: [ResizeEvent],
	data() {
		return {
			width: 0,
			height: 0,
		};
	},
	computed: {
		layout(): typeof Vue {
			if (!this.uniform || this.diceCount <= 3) return DiceFlowLayout;
			if (this.groupCount >= 5 && this.groupCount <= 10 && this.groupLength === 1) return DiceCircleLayout;
			return DiceRowLayout;
		},
		uniform(): boolean { return this.diceTypes.every((dice: any) => dice.length === this.diceTypes[0].length); },
		diceCount(): number { return this.diceTypes.reduce((sum, group) => sum += group.length, 0); },
		groupCount(): number { return this.diceTypes.length; },
		groupLength(): number { return this.diceTypes.length !== 0 ? this.diceTypes[0].length : 0; },
		is1D100(): boolean { return this.diceSet.size === 1 && this.diceSet.dices[0].max === 100; },
	},
	methods: {
		updateSize() {
			this.$nextTick(function () {
				const view = this.$el as Element;
				this.width = view.clientWidth;
				this.height = view.clientHeight;
			});
		},
	},
	mounted() { this.updateSize(); },
	resized() { this.updateSize(); },
	components: {
		DiceImage,
		DiceNumberDisplay,
	},
});