import Vue from 'vue';
import { DiceSet } from "models/dice";
import AppPage from "components/page/page.vue";
import DiceView from "components/dice-view/dice-view.vue";
import CustomDiceDialog from "components/dice/custom-dice-dialog/custom-dice-dialog.vue";

export default Vue.extend({
	name: 'dice-component',
	data() {
		return {
			type: null as (string | null),
			custom: {
				count: 1,
				max: 100,
			},
			values: [] as number[],
			presets: ['1D10', '1D100', '1D6', '2D6', '3D6', '1D3', '2D3', '1D4'],
			dialog: null as (typeof Vue | null),
		};
	},
	computed: {
		CUSTOM_TYPE() { return 'custom'; },
		diceSet(): DiceSet {
			if (this.type !== null) {
				if (this.type !== this.CUSTOM_TYPE) {
					return DiceSet.parse(this.type);
				} else {
					return DiceSet.create(this.custom.count, this.custom.max);
				}
			}
			return new DiceSet([]);
		},
		view(): any { return this.$refs.view; },
	},
	watch: {
		type(value) { this.reset(); },
		custom: {
			handler({ count, max }) {
				if (this.type === this.CUSTOM_TYPE) {
					this.reset();
				}
			},
			deep: true,
		}
	},
	methods: {
		reset() {
			this.values = this.diceSet.dices.map(x => x.default);
			this.view.stop();
		},
		roll() {
			this.values = this.diceSet.dices.map(x => x.roll(Math.random()));
			this.view.roll();
		},
		openCustomDiceDialog() {
			this.dialog = CustomDiceDialog;
		},
		closeCustomDiceDialog(result: { canceled: boolean, count?: number, max?: number }) {
			if (!result.canceled) {
				this.type = this.CUSTOM_TYPE;
				this.custom.count = result.count as number;
				this.custom.max = result.max as number;
			}
			this.dialog = null;
		},
	},
	components: {
		AppPage,
		DiceView,
	}
});