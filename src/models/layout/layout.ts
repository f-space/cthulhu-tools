import memoize from 'memoize-one';
import { DiceDisplay } from "models/dice";

export interface DiceRect {
	x: number;
	y: number;
	size: number;
}

export interface DiceLayout {
	compute(width: number, height: number, dices: DiceDisplay[][]): ReadonlyMap<DiceDisplay, DiceRect>;
}