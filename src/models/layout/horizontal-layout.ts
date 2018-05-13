import { DiceDisplay } from "models/dice";
import { DiceRect, DiceLayout } from "./layout";

const DICE_SPACE = 0.25;
const GROUP_SPACE = 0.5;
const MAX_SIZE_PROPORTION = 0.05;

export default class HorizontalDiceLayout implements DiceLayout {
	public compute(width: number, height: number, dices: DiceDisplay[][]): ReadonlyMap<DiceDisplay, DiceRect> {
		const result = new Map<DiceDisplay, DiceRect>();

		const count = dices.length;
		const length = dices.reduce((max, group) => Math.max(max, group.length), 0);
		if (count > 0 && length > 0) {
			const blockWidth = width / count;

			const ratio = length + DICE_SPACE * (length - 1) + GROUP_SPACE;
			const maxSize = this.getMaxSize(width, height);
			const rawSize = Math.floor(blockWidth / ratio);
			const size = Math.min(rawSize, maxSize);

			const y = Math.round((height - size) * 0.5);
			const diceStep = (1 + DICE_SPACE) * size;
			const diceOffset = (DICE_SPACE * size) / 2;

			for (const [i, group] of dices.entries()) {
				const groupWidth = diceStep * group.length;
				const groupOffset = (blockWidth - groupWidth) / 2;
				const groupX = blockWidth * i + groupOffset;
				for (const [j, dice] of group.entries()) {
					const x = Math.round(diceStep * j + groupX + diceOffset);

					result.set(dice, { x, y, size });
				}
			}
		}

		return result;
	}

	private getMaxSize(width: number, height: number): number {
		return Math.floor(Math.sqrt(width * height * MAX_SIZE_PROPORTION));
	}
}