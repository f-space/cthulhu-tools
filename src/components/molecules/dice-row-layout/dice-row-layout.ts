import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DiceDisplay } from "models/dice";
import SizeMixin, { mixin } from "mixins/size";

@Component
export default class DiceRowLayout extends mixin(Vue, SizeMixin) {
	@Prop({ required: true })
	public display: DiceDisplay[][];

	public get groups(): number { return this.display.length; }
	public get perGroup(): number { return this.display.length !== 0 ? this.display[0].length : 0; }
	public get rows(): number { return this.columns > 0 ? Math.ceil(this.groups / this.columns) : 0; }
	public get columns(): number { return this.getPreferredColumnSize(); }

	public get dices(): DiceDisplay[][][] {
		return this.getRowOffsets().map((_, i, offsets) => this.display.slice(offsets[i], offsets[i + 1]));
	}

	public get rowSize(): number { return this.rows > 0 ? this.height / this.rows : 0; }
	public get columnSize(): number { return this.columns > 0 ? this.width / this.columns : 0; }
	public get diceSize(): number { return Math.floor(Math.min(this.rowSize, this.columnSize / this.perGroup)); }

	private getPreferredColumnSize(): number {
		const count = this.groups;
		const ratio = (this.width / this.height) / this.perGroup;
		const column = Math.round((ratio + Math.sqrt(ratio * (ratio + 16 * count))) / 4);
		return Number.isSafeInteger(column) ? column : 0;
	}

	private getRowOffsets(): number[] {
		const count = this.groups;
		const columns = this.columns;
		const rows = this.rows;
		const rest = rows * columns - count;
		const steps = this.selectRowSteps(rows, rest);

		return Array.from(function* () {
			let offset = 0;
			for (let i = 0; i < rows; i++) {
				yield offset;
				offset += steps[i] ? columns - 1 : columns;
			}
		}());
	}

	private selectRowSteps(rows: number, count: number): { [row: number]: true } {
		function* split(list: number[], count: number): Iterable<number> {
			if (count > 0) {
				const halfLength = Math.floor(list.length / 2);
				const halfCount = Math.floor(count / 2);
				if (list.length % 2 === 0) {
					if (count % 2 === 0) {
						yield* split(list.slice(0, halfLength), halfCount);
						yield* split(list.slice(halfLength).reverse(), halfCount);
					} else {
						yield list[0];
						yield* split(list.slice(2, halfLength + 1).reverse(), halfCount);
						yield* split(list.slice(halfLength + 1).reverse(), halfCount);
					}
				} else {
					if (count % 2 === 0) {
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

		const steps = Object.create(null);
		for (let row of split([...Array(rows).keys()], count)) {
			steps[row] = true;
		}

		return steps;
	}
}