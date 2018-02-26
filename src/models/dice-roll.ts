import { Dice } from "models/dice";

export { Dice };

export interface DiceRollResult {
	readonly faces: ReadonlyArray<number>;
	readonly time: number;
}

export class DiceRoll {
	public readonly dices: ReadonlyArray<Dice>;
	private faces: number[];
	private time: number;

	private get result(): DiceRollResult {
		return {
			faces: this.faces,
			time: this.time,
		};
	}

	public constructor(dices: ReadonlyArray<Dice>, faces: ReadonlyArray<number>) {
		if (dices.length !== faces.length) throw new Error("'dices' and 'faces' must have the same length.");
		this.dices = dices;
		this.faces = Array.from(faces);
		this.time = 0;
	}

	public next(interval: number): Promise<DiceRollResult> {
		return new Promise(resolve => {
			setTimeout(() => {
				this.faces = this.generateNextFaces();
				this.time += interval;
				resolve(this.result);
			}, interval);
		});
	}

	public stop(): DiceRollResult {
		this.faces = this.generateRandomFaces();

		return this.result;
	}

	private generateNextFaces(): number[] {
		return this.dices.map((dice, index) => {
			const step = Math.floor(Math.random() * (dice.faces - 1)) + 1;
			const face = (this.faces[index] + step) % dice.faces;
			return face;
		});
	}

	private generateRandomFaces(): number[] {
		return this.dices.map(dice => Math.floor(Math.random() * dice.faces));
	}
}

export class DiceRollManager {
	private version: number = 0;

	public constructor(readonly interval: number = 100, readonly duration: number = 1000) { }

	public *start(roll: DiceRoll): IterableIterator<Promise<DiceRollResult | null>> {
		this.stop();

		const version = this.version;

		let done = false;
		while (!done) {
			yield roll.next(this.interval).then(async result => {
				if (version !== this.version) {
					return (done = true), null;
				} else if (result.time >= this.duration) {
					return (done = true), roll.stop();
				} else {
					return result;
				}
			});
		}
	}

	public stop(): void {
		this.version++;
	}
}