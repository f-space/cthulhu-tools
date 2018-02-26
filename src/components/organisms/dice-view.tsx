import React from 'react';
import classNames from 'classnames';
import { Dice, DiceDisplay } from "models/dice";
import FlexibleContainer from "components/functions/flexible-container";
import DiceImage from "components/atoms/dice-image";
import DiceNumberDisplay from "components/atoms/dice-number-display";
import DiceLayout, { DiceLayoutType } from "components/molecules/dice-layout";
import style from "styles/organisms/dice-view.scss";

export interface DiceViewProps extends React.HtmlHTMLAttributes<HTMLDivElement>{
	dices: ReadonlyArray<Dice>;
	faces: ReadonlyArray<number>;
}

export default class DiceView extends React.Component<DiceViewProps> {
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
					<DiceLayout {...size} className={style['layout']} type={layout}>
						{display.map(this.renderDiceGroup)}
					</DiceLayout>
					<DiceNumberDisplay {...size} {...state} className={style['number']} digits={digits} value={value} />
				</React.Fragment>
			}

			return null;
		}} />
	}

	private renderDiceGroup(group: DiceDisplay[], index: number) {
		return <div key={index} className={style['group']}>
			{group.map((dice, n) => <DiceImage key={n} className={style['dice']} type={dice.type} face={dice.face} />)}
		</div>
	}

	private selectLayout(dices: ReadonlyArray<Dice>): DiceLayoutType {
		const count = dices.length;
		const uniform = !dices.some(dice => dice.type !== dices[0].type);
		if (count <= 3 || !uniform) return 'flow';

		const sample = dices[0];
		const length = sample.display(sample.default).length;
		if (count <= 10 && length === 1) return 'circle';

		return 'row';
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