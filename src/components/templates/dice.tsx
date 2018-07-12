import React from 'react';
import { Dice } from "models/dice";
import { DiceRoll, DiceRollTask } from "models/dice-roll";
import { DiceSound } from "components/functions/dice-sound";
import { DiceView } from "components/organisms/dice-view";
import { DiceTypeSelector } from "components/organisms/dice-type-selector";
import { CustomDiceDialog, CustomDiceDialogResult } from "components/dialogs/custom-dice";
import { Page } from "./shared/page";
import style from "styles/templates/dice.scss";

interface DiceTemplateProps { }

interface DiceTemplateState {
	type?: string;
	faces: ReadonlyArray<number>;
	custom: { count: number, max: number };
	openCustomDiceDialog: boolean;
}

const PRESETS = ['custom', '1D10', '1D100', '1D6', '2D6', '3D6', '1D3', '2D3', '1D4'];

export class DiceTemplate extends React.Component<DiceTemplateProps, DiceTemplateState> {
	private task?: DiceRollTask;
	private soundRef: React.RefObject<DiceSound> = React.createRef();

	public constructor(props: DiceTemplateProps) {
		super(props);

		this.state = {
			type: undefined,
			faces: [],
			custom: { count: 1, max: 100 },
			openCustomDiceDialog: false,
		};
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handleRollClick = this.handleRollClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	public componentWillUnmount(): void {
		this.stop();
	}

	public render() {
		const { type, custom, faces } = this.state;
		const dices = this.getDices(type, custom) || [];

		return <Page id="dice" heading={<h2>ダイスロール</h2>}>
			<DiceSound ref={this.soundRef} />
			<DiceView className={style['view']} dices={dices} faces={faces} />
			<DiceTypeSelector className={style['selector']} types={PRESETS} selected={this.state.type} onTypeChange={this.handleTypeChange} />
			<button className={style['roll']} onClick={this.handleRollClick}>
				Roll
			</button>
			<CustomDiceDialog open={this.state.openCustomDiceDialog} {...this.state.custom} onClose={this.handleClose} />
		</Page>
	}

	private handleTypeChange(type: string): void {
		if (type === 'custom') {
			this.setState({ openCustomDiceDialog: true });
		} else {
			this.setState({ type });
			this.reset();
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
			this.reset();
		}

		this.setState({ openCustomDiceDialog: false });
	}

	private reset(): void {
		this.stop();

		this.setState(({ type, custom }) => {
			const dices = this.getDices(type, custom);
			const faces = dices ? dices.map(dice => dice.default) : [];
			return { faces };
		});
	}

	private roll(): void {
		this.stop();

		const { type, custom } = this.state;
		const dices = this.getDices(type, custom);
		if (dices) {
			const sound = this.soundRef.current;
			if (sound) sound.play();

			const roll = new DiceRoll(dices).set(this.state.faces);;
			this.task = roll.run(faces => {
				this.setState({ faces });
			});
		}
	}

	private stop(): void {
		if (this.task !== undefined) {
			this.task.stop();
			this.task = undefined;
		}
	}

	private getDices(type: string | undefined, custom: { count: number, max: number }): Dice[] | undefined {
		if (type === undefined) {
			return undefined;
		} else if (type !== 'custom') {
			return Dice.parse(type);
		} else {
			return Dice.create(custom.count, custom.max);
		}
	}
}