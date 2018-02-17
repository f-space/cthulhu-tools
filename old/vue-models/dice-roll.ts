import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Dice, DiceDisplay } from "models/dice";
import { DiceSoundManager } from "models/resource";

function sleep(time: number): Promise<void> {
	return new Promise(resolve => { setTimeout(resolve, time); });
}

@Component({ model: { prop: 'faces' } })
export default class DiceRoll extends Vue {
	@Prop({ required: true })
	public readonly dices!: Dice[];

	@Prop({ required: true })
	public readonly faces!: number[];

	@Prop({ default: 100 })
	public readonly interval!: number;

	@Prop({ default: 1000 })
	public readonly duration!: number;

	private version: number = 0;

	private player: HTMLAudioElement | null = null;

	protected created(): void {
		DiceSoundManager.load()
			.then(() => DiceSoundManager.player())
			.then(player => { this.player = player; });
	}

	public roll(): Promise<void> {
		this.playSound();

		return this.rollInternal();
	}

	public stop(): void {
		this.version++;
	}

	public generateNextFaces(): number[] {
		return this.dices.map((dice, index) => {
			return (this.faces[index] + Math.floor(Math.random() * (dice.faces - 1)) + 1) % dice.faces;
		});
	}

	public generateRandomFaces(): number[] {
		return this.dices.map(dice => Math.floor(Math.random() * dice.faces));
	}

	public playSound(): void {
		const sound = this.player;
		if (sound !== null) {
			sound.pause();
			sound.currentTime = 0
			sound.play();
		}
	}

	protected onDiceInput(faces: number[]): void {
		this.$emit('input', faces);
	}

	protected onDiceChange(faces: number[]): void {
		this.$emit('change', faces);
	}

	private async rollInternal() {
		const version = ++this.version;
		const time = Date.now();

		while (version === this.version && Date.now() - time < this.duration) {
			this.onDiceInput(this.generateNextFaces());
			await sleep(this.interval);
		}

		if (version === this.version) {
			const faces = this.generateRandomFaces();
			this.onDiceInput(faces);
			this.onDiceChange(faces);
		}
	}
}