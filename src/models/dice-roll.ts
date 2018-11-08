import { Dice } from "models/dice";

export interface DiceRoll {
	next(dices: ReadonlyArray<Dice>, current: ReadonlyArray<number>): number[];
	last(dices: ReadonlyArray<Dice>): number[];
}

export class UniformDiceRoll implements DiceRoll {
	public next(dices: ReadonlyArray<Dice>, current: ReadonlyArray<number>): number[] {
		return dices.map((dice, index) => {
			const offset = Math.floor(Math.random() * (dice.faces - 1)) + 1;
			const face = (current[index] + offset) % dice.faces;
			return face;
		});
	}

	public last(dices: ReadonlyArray<Dice>): number[] {
		return dices.map(dice => Math.floor(Math.random() * dice.faces));
	}
}