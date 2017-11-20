import Vue from 'vue';
import { DiceSet, Dice } from 'models/dice';

export default Vue.extend({
	name: "dice-roll",
	inject: ["app"],
	props: {
		diceSet: {
			type: DiceSet,
			required: true,
		},
		values: {
			type: Array as { (): number[] },
			required: true,
		},
		interval: {
			type: Number,
			default: 100,
		},
		duration: {
			type: Number,
			default: 1000,
		},
		maxIteration: {
			type: Number,
			default: 10,
		},
	},
	data() {
		return {
			display: this.values,
			rolling: false,
			version: 0,
			time: 0,
		};
	},
	computed: {
		dices(): { type: string, face: number }[][] {
			return this.diceSet.dices.map((dice, i) => {
				const value = dice.validate(this.diceValues[i]) ? this.diceValues[i] : dice.default;
				return this.selectDice(dice, value);
			});
		},
		diceValues(): number[] { return this.rolling ? this.display : this.values; },
		diceTypes(): string[][] {
			return this.diceSet.dices.map(dice => {
				return this.selectDice(dice, dice.default).map(x => x.type);
			})
		}
	},
	watch: {
		rolling(value) {
			if (value) {
				this.version++;
				this.time = Date.now();
				this.update(this.version);

				this.playSound();
			}
		}
	},
	methods: {
		roll() { this.rolling = true; },
		stop() { this.rolling = false; },
		update(version: number) {
			if (this.rolling && version === this.version) {
				if (Date.now() - this.time < this.duration) {
					this.updateDisplay();

					setTimeout(() => this.update(version), this.interval);
				} else {
					this.rolling = false;
				}
			}
		},
		updateDisplay() {
			this.display = this.diceSet.dices.map((dice, index) => {
				for (let i = 1; i < this.maxIteration; i++) {
					const value = dice.roll(Math.random());
					if (value !== this.display[index]) return value;
				}
				return dice.roll(Math.random());
			});
		},
		selectDice(dice: Dice, value: number) {
			if (dice.max <= 6) return this.getD6(value);
			if (dice.max <= 10) return this.getD10(value);
			if (dice.max <= 100) return this.getD100(value);
			return this.getD10x(Math.ceil(Math.log10(dice.max)), value);
		},
		getD6(value: number) {
			return [{ type: 'D6', face: value }];
		},
		getD10(value: number) {
			return [{ type: 'D10', face: value }];
		},
		getD100(value: number) {
			return [
				{ type: 'D100', face: Math.floor(value / 10) || 10 },
				{ type: 'D10', face: value % 10 || 10 },
			];
		},
		getD10x(count: number, value: number) {
			return Array.from(function* () {
				for (let i = 0; i < count; i++) {
					yield { type: 'D10', face: value % 10 || 10 };
					value = Math.floor(value / 10)
				}
			}()).reverse();
		},
		playSound(this: any) {
			const audio = this.app.resources.diceSound as HTMLAudioElement;
			audio.pause();
			audio.currentTime = 0
			audio.play();
		},
	},
});