import memoize from 'memoize-one';
import { DiceDisplay } from "models/dice";
import { DiceRect, DiceLayout } from "./layout";

const DICE_SPACE = 0.1;
const GROUP_SPACE = 0.5;
const ROW_SPACE = 0.2;
const MAX_SIZE_PROPORTION = 0.05;

export default class RowDiceLayout implements DiceLayout {
	public constructor() {
		this.selectSteps = memoize(this.selectSteps);
		this.getOffsets = memoize(this.getOffsets);
	}

	public compute(width: number, height: number, dices: DiceDisplay[][]): ReadonlyMap<DiceDisplay, DiceRect> {
		const result = new Map<DiceDisplay, DiceRect>();

		const count = dices.length;
		const length = dices.reduce((max, group) => Math.max(max, group.length), 0);
		if (count > 0 && length > 0) {
			const [weightX, weightY] = this.getWeight(length);
			const w = width / weightX;
			const h = height / weightY;

			const [rows, columns] = this.selectGridSize(w, h, count);
			const steps = this.selectSteps(rows, rows * columns - count);
			const offsets = this.getOffsets(rows, columns, steps);

			const maxSize = this.getMaxSize(width, height);
			const rawSize = Math.floor(Math.min(w / columns, h / rows));
			const size = Math.min(maxSize, rawSize);

			const cellWidth = width / columns;
			const cellHeight = height / rows;
			const rowOffsetY = (cellHeight - size) / 2;
			const diceStep = (1 + DICE_SPACE) * size;
			const diceOffsetX = (DICE_SPACE * size) / 2;

			const rowGroups = offsets.map((_, i, offsets) => dices.slice(offsets[i], offsets[i + 1]));
			for (const [i, row] of rowGroups.entries()) {
				const y = Math.round(cellHeight * i + rowOffsetY);
				const blanks = columns - row.length;
				const rowOffsetX = (cellWidth * blanks) / 2;

				for (const [j, group] of row.entries()) {
					const groupWidth = diceStep * group.length;
					const groupOffsetX = (cellWidth - groupWidth) / 2;
					const groupX = cellWidth * j + rowOffsetX + groupOffsetX;

					for (const [k, dice] of group.entries()) {
						const x = Math.round(diceStep * k + groupX + diceOffsetX);

						result.set(dice, { x, y, size });
					}
				}
			}
		}

		return result;
	}

	private getMaxSize(width: number, height: number): number {
		return Math.floor(Math.sqrt(width * height * MAX_SIZE_PROPORTION));
	}

	private getWeight(length: number): [number, number] {
		const weightX = length + DICE_SPACE * (length - 1) + GROUP_SPACE;
		const weightY = 1 + ROW_SPACE;
		return [weightX, weightY];
	}

	private selectGridSize(width: number, height: number, count: number): [number, number] {
		const ratio = width / height;
		const rationalColumns = (ratio + Math.sqrt(ratio * (ratio + 16 * count))) / 4;
		const columns = Math.min(Math.max(Math.round(rationalColumns), 1), count);
		const rows = Math.ceil(count / columns);
		return [rows, columns];
	}

	private selectSteps(rows: number, blanks: number): number[] {
		function* split(list: number[], rest: number): Iterable<number> {
			if (rest > 0) {
				const halfLength = Math.floor(list.length / 2);
				const halfCount = Math.floor(rest / 2);
				if (list.length % 2 === 0) {
					if (rest % 2 === 0) {
						yield* split(list.slice(0, halfLength), halfCount);
						yield* split(list.slice(halfLength).reverse(), halfCount);
					} else {
						yield list[0];
						yield* split(list.slice(2, halfLength + 1).reverse(), halfCount);
						yield* split(list.slice(halfLength + 1).reverse(), halfCount);
					}
				} else {
					if (rest % 2 === 0) {
						yield* split(list.slice(0, halfLength), halfCount);
						yield* split(list.slice(halfLength + 1).reverse(), halfCount);
					} else {
						yield* split(list.slice(0, halfLength), halfCount);
						yield list[halfLength];
						yield* split(list.slice(halfLength + 1).reverse(), halfCount);
					}
				}
			}
		}

		return Array.from(split([...Array(rows).keys()], blanks)).sort((x, y) => x - y);
	}

	private getOffsets(rows: number, columns: number, steps: number[]): number[] {
		function* offset() {
			for (let i = 0, n = 0; i < rows; i++) {
				yield (columns * i) - n;
				if (i === steps[n]) n++;
			}
		}

		return Array.from(offset());
	}
}