import React from 'react';
import { DiceDisplay } from "models/dice";
import { DiceImageManager } from "models/resource";
import style from "styles/molecules/dice-group.scss";

export interface DiceGroupProps {
	dices: DiceDisplay[];
}

export default class DiceGroup extends React.Component<DiceGroupProps> {
	private elements: React.RefObject<HTMLImageElement>[];

	public constructor(props: DiceGroupProps) {
		super(props);

		this.elements = [...Array(props.dices.length)].map(() => React.createRef());
	}

	public componentDidMount(): void {
		DiceImageManager.load();

		this.updateDiceImages(this.props.dices);
	}

	public UNSAFE_componentWillReceiveProps(nextProps: DiceGroupProps): void {
		if (this.props.dices.length === nextProps.dices.length) {
			this.updateDiceImages(nextProps.dices);
		}
	}

	public shouldComponentUpdate(nextProps: DiceGroupProps): boolean {
		return (this.props.dices.length !== nextProps.dices.length);
	}

	public UNSAFE_componentWillUpdate(nextProps: DiceGroupProps): void {
		this.elements = [...Array(nextProps.dices.length)].map(() => React.createRef());
	}

	public componentDidUpdate(): void {
		this.updateDiceImages(this.props.dices);
	}

	public render() {
		return <div className={style['group']}>
			{this.props.dices.map((dice, n) => <img key={n} className={style['dice']} ref={this.elements[n]} />)}
		</div>
	}

	private updateDiceImages(dices: DiceDisplay[]) {
		DiceImageManager.load().then(() => {
			for (const [index, element] of this.elements.entries()) {
				const img = element.current;
				if (img) {
					const { type, face } = dices[index];
					img.src = DiceImageManager.get(type, face);
				}
			}
		});
	}
}