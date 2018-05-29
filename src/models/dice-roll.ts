import { Dice } from "models/dice";

export class DiceRoll {
	public readonly dices: ReadonlyArray<Dice>;
	private faces: ReadonlyArray<number>;

	public constructor(dices: ReadonlyArray<Dice>) {
		this.dices = dices;
		this.faces = dices.map(dice => dice.default);
	}

	public set(faces: ReadonlyArray<number>): this {
		if (faces.length !== this.dices.length) {
			throw new Error("'faces' must have the same length of 'dices'.");
		}

		this.faces = Array.from(faces);

		return this;
	}

	public next(): ReadonlyArray<number> {
		return this.faces = this.generateNextFaces();
	}

	public end(): ReadonlyArray<number> {
		return this.faces = this.generateRandomFaces();
	}

	public run(callback: (faces: ReadonlyArray<number>) => void, interval?: number, duration?: number): DiceRollTask {
		return new DiceRollTask(this, interval, duration).start(callback);
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

export class DiceRollTask {
	private id?: number;
	private elapsed: number = 0;

	public constructor(readonly roll: DiceRoll, readonly interval: number = 100, readonly duration: number = 1000) { }

	public start(callback: (faces: ReadonlyArray<number>) => void): this {
		if (this.id === undefined) {
			this.id = window.setInterval(() => {
				this.elapsed += this.interval;
				if (this.elapsed < this.duration) {
					callback.call(null, this.roll.next());
				} else {
					callback.call(null, this.roll.end());
					this.stop();
				}
			}, this.interval);
		}

		return this;
	}

	public stop(): this {
		if (this.id !== undefined) {
			window.clearInterval(this.id);
			this.id = undefined;
		}

		return this;
	}
}