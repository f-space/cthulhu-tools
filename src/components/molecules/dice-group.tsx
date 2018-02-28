import React from 'react';
import { DiceDisplay } from "models/dice";
import { DiceImageManager } from "models/resource";
import style from "styles/molecules/dice-group.scss";

export interface DiceGroupProps {
	dices: DiceDisplay[];
}

export default class DiceGroup extends React.Component<DiceGroupProps> {
	private elements: (HTMLImageElement | null)[] = [];

	public componentWillMount(): void {
		DiceImageManager.load();
	}

	public componentDidMount(): void {
		this.updateDiceImages(this.props.dices);
	}

	public componentWillReceiveProps(nextProps: DiceGroupProps): void {
		if (this.props.dices.length === nextProps.dices.length) {
			this.updateDiceImages(nextProps.dices);
		}
	}

	public shouldComponentUpdate(nextProps: DiceGroupProps): boolean {
		return (this.props.dices.length !== nextProps.dices.length);
	}

	public componentWillUpdate(): void {
		this.elements = Array(this.props.dices.length);
	}

	public componentDidUpdate(): void {
		this.updateDiceImages(this.props.dices);
	}

	public render() {
		return <div className={style['group']}>
			{this.props.dices.map((dice, n) => <img key={n} className={style['dice']} ref={el => { this.elements[n] = el; }} />)}
		</div>
	}

	private updateDiceImages(dices: DiceDisplay[]) {
		DiceImageManager.load().then(() => {
			for (const [index, element] of this.elements.entries()) {
				if (element) {
					const { type, face } = dices[index];
					element.src = DiceImageManager.get(type, face);
				}
			}
		});
	}
}