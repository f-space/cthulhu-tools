import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { DiceSet, Dice } from "models/dice";
import { DiceSoundManager } from "models/resource";

type DiceType = 'D6' | 'D10' | 'D100';
type DiceInfo = { type: DiceType, face: number };

@Component
export default class DiceRoll extends Vue {
	@Prop({ required: true })
	public diceSet: DiceSet;

	@Prop({ required: true })
	public values: number[];

	@Prop({ default: 100 })
	public interval: number;

	@Prop({ default: 1000 })
	public duration: number;

	@Prop({ default: 10 })
	public maxIteration: number;

	private display: number[] = this.values;
	private rolling: boolean = false;
	private version: number = 0;
	private time: number = 0;
	private player: HTMLAudioElement | null = null;

	public get dices(): DiceInfo[][] {
		return this.diceSet.dices.map((dice, i) => {
			const value = dice.validate(this.diceValues[i]) ? this.diceValues[i] : dice.default;
			return this.selectDice(dice, value);
		});
	}

	public get diceValues(): number[] { return this.rolling ? this.display : this.values; }

	public get diceTypes(): DiceType[][] {
		return this.diceSet.dices.map(dice => {
			return this.selectDice(dice, dice.default).map(x => x.type);
		})
	}

	@Watch("rolling")
	private onRollingChanged(value: boolean): void {
		if (value) {
			this.version++;
			this.time = Date.now();
			this.update(this.version);

			this.playSound();
		}
	}

	protected created(): void {
		DiceSoundManager.load()
			.then(() => DiceSoundManager.player())
			.then(player => { this.player = player; });
	}

	public roll(): void { this.rolling = true; }

	public stop(): void { this.rolling = false; }

	private update(version: number): void {
		if (this.rolling && version === this.version) {
			if (Date.now() - this.time < this.duration) {
				this.updateDisplay();

				setTimeout(() => this.update(version), this.interval);
			} else {
				this.rolling = false;
			}
		}
	}

	private updateDisplay(): void {
		this.display = this.diceSet.dices.map((dice, index) => {
			for (let i = 1; i < this.maxIteration; i++) {
				const value = dice.roll(Math.random());
				if (value !== this.display[index]) return value;
			}
			return dice.roll(Math.random());
		});
	}

	private selectDice(dice: Dice, value: number): DiceInfo[] {
		if (dice.max <= 6) return this.getD6(value);
		if (dice.max <= 10) return this.getD10(value);
		if (dice.max <= 100) return this.getD100(value);
		return this.getD10x(Math.ceil(Math.log10(dice.max)), value);
	}

	private getD6(value: number): DiceInfo[] {
		return [{ type: 'D6', face: value - 1 }];
	}

	private getD10(value: number): DiceInfo[] {
		return [{ type: 'D10', face: value % 10 }];
	}

	private getD100(value: number): DiceInfo[] {
		return [
			{ type: 'D100', face: Math.floor(value / 10) % 10 },
			{ type: 'D10', face: value % 10 },
		];
	}

	private getD10x(count: number, value: number): DiceInfo[] {
		return Array.from(function* () {
			for (let i = 0; i < count; i++) {
				yield { type: 'D10' as DiceType, face: value % 10 };
				value = Math.floor(value / 10)
			}
		}()).reverse();
	}

	private playSound(): void {
		const sound = this.player;
		if (sound !== null) {
			sound.pause();
			sound.currentTime = 0
			sound.play();
		}
	}
}