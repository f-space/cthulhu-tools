import React from 'react';
import classNames from 'classnames';
import { Dice, DiceRoll, DiceRollManager } from "models/dice-roll";
import { DiceSound } from "components/functions/dice-sound";
import { DiceView } from "components/organisms/dice-view";
import { DiceTypeSelector } from "components/organisms/dice-type-selector";
import { Page } from "components/templates/page";
import { CustomDiceDialog, CustomDiceDialogResult } from "components/dialogs/custom-dice";
import style from "styles/pages/dice.scss";

interface DicePageState {
	type?: string;
	faces: ReadonlyArray<number>;
	custom: { count: number, max: number };
	openCustomDiceDialog: boolean;
}

const PRESETS = ['custom', '1D10', '1D100', '1D6', '2D6', '3D6', '1D3', '2D3', '1D4'];

export class DicePage extends React.Component<{}, DicePageState> {
	private dices?: Dice[];
	private readonly roller: DiceRollManager;
	private soundRef: React.RefObject<DiceSound> = React.createRef();

	public constructor(props: {}) {
		super(props);

		this.state = {
			type: undefined,
			faces: [],
			custom: { count: 1, max: 100 },
			openCustomDiceDialog: false,
		};
		this.roller = new DiceRollManager();
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handleRollClick = this.handleRollClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	public UNSAFE_componentWillUpdate(nextProps: {}, nextState: DicePageState): void {
		if (this.checkDiceChanged(nextState)) {
			this.dices = this.getDices(nextState);
			this.roller.stop();
		}
	}

	public render() {
		const dices = this.dices || [];
		const faces = this.state.faces;

		return <Page id="dice" heading={<h2>ダイスロール</h2>}>
			<DiceSound ref={this.soundRef} />
			<DiceView className={style['view']} dices={dices} faces={faces} />
			<DiceTypeSelector className={style['selector']} types={PRESETS} selected={this.state.type} onTypeChange={this.handleTypeChange} />
			<button className={style['roll']} onClick={this.handleRollClick}>
				Roll
			</button>
			<CustomDiceDialog when={this.state.openCustomDiceDialog} {...this.state.custom} onClose={this.handleClose} />
		</Page>
	}

	private handleTypeChange(type: string): void {
		if (type === 'custom') {
			this.setState({ openCustomDiceDialog: true });
		} else {
			this.setState({ type });
			this.setDefaultFaces();
		}
	}

	private handleRollClick(): void {
		this.roll();
	}

	private handleClose(result?: CustomDiceDialogResult): void {
		if (result) {
			this.setState({
				type: 'custom',
				custom: {
					count: result.count,
					max: result.max,
				}
			});
			this.setDefaultFaces();
		}

		this.setState({ openCustomDiceDialog: false });
	}

	private setDefaultFaces(): void {
		this.setState(current => {
			const dices = this.getDices(current);
			const faces = dices ? dices.map(dice => dice.default) : [];
			return { faces };
		});
	}

	private async roll(): Promise<void> {
		if (this.dices) {
			const sound = this.soundRef.current;
			if (sound) sound.play();

			for (const roll of this.roller.start(new DiceRoll(this.dices, this.state.faces))) {
				const result = await roll;
				if (result) {
					this.setState({ faces: result.faces });
				}
			}
		}
	}

	private checkDiceChanged({ type, custom }: DicePageState): boolean {
		if (this.state.type !== type) return true;
		if (this.state.custom.count !== custom.count) return true;
		if (this.state.custom.max !== custom.max) return true;
		return false;
	}

	private getDices({ type, custom }: DicePageState): Dice[] | undefined {
		if (type === undefined) {
			return undefined;
		} else if (type !== 'custom') {
			return Dice.parse(type);
		} else {
			return Dice.create(custom.count, custom.max);
		}
	}
}