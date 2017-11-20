import Vue from 'vue';
import DiceLayout from "components/dice-layout/dice-layout";

export default DiceLayout.extend({
	name: "dice-row-layout",
	computed: {
		rowDices(): { type: string, face: number }[][][] { return this.getRowDices(); },
		rows(): number { return this.columns > 0 ? Math.ceil(this.groupCount / this.columns) : 0; },
		columns(): number { return this.getPreferredColumnSize(); },
		offsets(): number[] { return this.getRowOffsets(); },
		rowSize(): number { return this.rows > 0 ? this.height / this.rows : 0; },
		columnSize(): number { return this.columns > 0 ? this.width / this.columns : 0; },
		displaySize(): number { return Math.floor(Math.min(this.rowSize, this.columnSize / this.groupLength)); },
		style(): object { return { "--dice-size": `${this.displaySize}px` }; },
	},
	methods: {
		getRowDices() {
			return this.offsets.map((_, i, offsets) => this.dices.slice(offsets[i], offsets[i + 1]));
		},
		getPreferredColumnSize() {
			const count = this.groupCount;
			const ratio = (this.width / this.height) / this.groupLength;
			const column = Math.round((ratio + Math.sqrt(ratio * (ratio + 16 * count))) / 4);
			return Number.isSafeInteger(column) ? column : 0;
		},
		getRowOffsets() {
			const count = this.groupCount;
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
		},
		selectRowSteps(rows: number, count: number) {
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
		},
	},
});