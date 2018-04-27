import React from 'react';
import classNames from 'classnames';
import { DiceDisplay } from "models/dice";
import style from "styles/molecules/row-dice-layout.scss";

export interface RowDiceLayoutProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	width: number;
	height: number;
	dices: DiceDisplay[][];
	render(group: DiceDisplay[]): React.ReactNode;
}

function Wrapper(props: { children?: React.ReactNode }) { return <>{props.children}</>; };

export default class RowDiceLayout extends React.Component<RowDiceLayoutProps> {
	private groupCount!: number;
	private groupLength!: number;
	private diceSize!: number;
	private offsets!: number[];

	public constructor(props: RowDiceLayoutProps) {
		super(props);

		this.precompute(props);
	}

	public componentWillUpdate(nextProps: RowDiceLayoutProps) {
		if (this.isInvalid(nextProps)) {
			this.precompute(nextProps);
		}
	}

	public render() {
		const { width, height, dices, render, className, ...rest } = this.props;
		const rows = this.offsets.map((_, i, offsets) => dices.slice(offsets[i], offsets[i + 1]));

		return <div {...rest} className={classNames(className, style['layout'])} style={{ '--dice-size': `${this.diceSize}px` } as any}>
			{
				rows.map((row, rowIndex) => {
					return <div key={rowIndex} className={style['row']}>
						{row.map((group, groupIndex) => <Wrapper key={groupIndex}>{render(group)}</Wrapper>)}
					</div>
				})
			}
		</div>
	}

	private getGroupInfo(dices: DiceDisplay[][]): { count: number, length: number } {
		const count = dices.length;
		const length = dices.reduce((max, group) => Math.max(max, group.length), 1);
		return { count, length };
	}

	private isInvalid({ width, height, dices }: RowDiceLayoutProps): boolean {
		if (this.props.width !== width) return true;
		if (this.props.height !== height) return true;
		if (this.props.dices !== dices) {
			const { count, length } = this.getGroupInfo(dices);
			if (this.groupCount !== count) return true;
			if (this.groupLength !== length) return true;
		}
		return false;
	}

	private precompute({ width, height, dices }: RowDiceLayoutProps): void {
		const { count, length } = this.getGroupInfo(dices);
		this.groupCount = count;
		this.groupLength = length;

		const ratio = (width / height) / length;
		const columns = Math.round((ratio + Math.sqrt(ratio * (ratio + 16 * count))) / 4);
		const rows = Math.ceil(count / columns);
		if (Number.isSafeInteger(columns) && Number.isSafeInteger(rows) && columns > 0 && rows > 0) {
			const rowSize = height / rows;
			const columnSize = width / (columns * length);
			this.diceSize = Math.floor(Math.min(rowSize, columnSize));

			const steps = this.selectSteps(rows, rows * columns - count);
			this.offsets = this.getOffsets(rows, columns, steps);
		} else {
			this.diceSize = 0;
			this.offsets = [];
		}
	}

	private selectSteps(rows: number, count: number): number[] {
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

		return Array.from(split([...Array(rows).keys()], count)).sort((x, y) => x - y);
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