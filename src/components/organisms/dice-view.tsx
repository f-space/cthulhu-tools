import React from 'react';
import classNames from 'classnames';
import memoize from 'memoize-one';
import { Dice, DiceDisplay } from "models/dice";
import { DiceLayout as Layout } from "models/layout/layout";
import HorizontalLayout from "models/layout/horizontal-layout";
import CircleLayout from "models/layout/circle-layout";
import RowLayout from "models/layout/row-layout";
import FlexibleContainer from "components/functions/flexible-container";
import DiceNumberDisplay from "components/atoms/dice-number-display";
import DiceLayout from "components/molecules/dice-layout";
import style from "styles/organisms/dice-view.scss";

export interface DiceViewProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	dices: ReadonlyArray<Dice>;
	faces: ReadonlyArray<number>;
}

export default class DiceView extends React.Component<DiceViewProps> {
	public constructor(props: DiceViewProps) {
		super(props);

		this.selectLayout = memoize(this.selectLayout);
	}

	public render() {
		const { dices, faces, className, ...rest } = this.props;

		return <FlexibleContainer className={classNames(className, style['view'])} render={size => {
			if (dices.length !== 0) {
				const layout = this.selectLayout(dices);
				const value = this.getValue(dices, faces);
				const display = this.getDisplay(dices, faces);
				const digits = this.getDigits(dices);
				const state = this.getState(dices, value);

				return <React.Fragment>
					<DiceLayout {...size} className={style['layout']} layout={layout} dices={display} />
					<DiceNumberDisplay {...size} {...state} className={style['number']} digits={digits} value={value} />
				</React.Fragment>
			}

			return null;
		}} />
	}

	private selectLayout(dices: ReadonlyArray<Dice>): Layout {
		const uniform = !dices.some(dice => dice.type !== dices[0].type);
		if (uniform) {
			const sample = dices[0];
			const length = sample.display(sample.default).length;
			if (length === 1) {
				const count = dices.length;
				if (count <= 3) return new HorizontalLayout();
				if (count <= 10) return new CircleLayout();
			}
		}
		return new RowLayout();
	}

	private getValue(dices: ReadonlyArray<Dice>, faces: ReadonlyArray<number>): number {
		return dices.reduce((sum, dice, index) => sum + dice.value(faces[index]), 0);
	}

	private getDisplay(dices: ReadonlyArray<Dice>, faces: ReadonlyArray<number>): DiceDisplay[][] {
		return dices.map((dice, i) => dice.display(faces[i]));
	}

	private getDigits(dices: ReadonlyArray<Dice>): number {
		const max = dices.reduce((sum, dice) => sum + dice.value(dice.max), 0);
		const digits = max > 0 ? Math.floor(Math.log10(max) + 1) : 1;
		return digits;
	}

	private getState(dices: ReadonlyArray<Dice>, value: number): { critical?: boolean, fumble?: boolean } {
		return this.is1D100(dices) ? { critical: value > 95, fumble: value <= 5 } : {};
	}

	private is1D100(dices: ReadonlyArray<Dice>): boolean {
		return dices.length === 1 && dices[0].type === 'D100' && dices[0].faces === 100;
	}
}