import { DiceDisplay } from "models/dice";
import { DiceRect, DiceLayout } from "./layout";

const DICE_SPACE = 0.25;
const MAX_SIZE_PROPORTION = 0.05;

export default class CircleDiceLayout implements DiceLayout {
	public compute(width: number, height: number, dices: DiceDisplay[][]): ReadonlyMap<DiceDisplay, DiceRect> {
		const result = new Map<DiceDisplay, DiceRect>();

		const count = dices.length;
		const length = dices.reduce((max, group) => Math.max(max, group.length), 0);
		if (count > 0 && length > 0) {
			const angle = Math.PI * 2 / count;
			const offset = (count % 2 == 0 ? angle * 0.5 : 0);

			const outerRadius = Math.min(width, height) / 2;
			const innerRadius = count !== 1 ? outerRadius / (1 + Math.sqrt(2 / (1 - Math.cos(angle)))) : outerRadius;
			const radius = outerRadius - innerRadius;

			const centerX = width / 2;
			const centerY = height / 2;

			const ratio = length + DICE_SPACE * (length - 1);
			const maxSize = this.getMaxSize(width, height);
			const rawSize = Math.floor(Math.sqrt(innerRadius * innerRadius / (ratio * ratio + 1)) * 2);
			const size = Math.min(rawSize, maxSize);

			const diceStep = (1 + DICE_SPACE) * size;

			for (const [i, group] of dices.entries()) {
				const cx = centerX - Math.sin(angle * i + offset) * radius;
				const cy = centerY - Math.cos(angle * i + offset) * radius;

				const y = Math.round(cy - size * 0.5);
				const groupOffset = cx - size * ratio * 0.5;
				for (const [j, dice] of group.entries()) {
					const x = Math.round(diceStep * j + groupOffset);

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