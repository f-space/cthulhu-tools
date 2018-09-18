import React from 'react';
import { Dice } from "models/dice";
import { DiceRollTask } from "components/shared/functions/dice-roll-task";
import { RollButton } from "components/shared/widgets/roll-button";
import { DiceView } from "./dice-view";
import { DiceTypeSelector } from "./dice-type-selector";
import { CustomDiceDialog, CustomDiceDialogResult } from "./custom-dice-dialog";
import { Page } from "components/shared/templates/page";
import style from "./template.scss";

export interface DiceTemplateProps { }

interface DiceTemplateState {
	type?: string;
	custom: CustomDiceConfig;
	faces: ReadonlyArray<number>;
	rolling: boolean;
	openCustomDiceDialog: boolean;
}

interface CustomDiceConfig {
	count: number;
	max: number;
}

const PRESETS = ['custom', '1D10', '1D100', '1D6', '2D6', '3D6', '1D3', '2D3', '1D4'];

export class DiceTemplate extends React.Component<DiceTemplateProps, DiceTemplateState> {
	public constructor(props: DiceTemplateProps) {
		super(props);

		this.state = {
			type: undefined,
			custom: { count: 1, max: 100 },
			faces: [],
			rolling: false,
			openCustomDiceDialog: false,
		};
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handleRollClick = this.handleRollClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.updateFaces = this.updateFaces.bind(this);
	}

	public render() {
		const { type, custom, faces, rolling, openCustomDiceDialog } = this.state;
		const dices = this.getDices(type, custom);
		const ready = (dices.length !== 0 && !rolling);

		return <Page id="dice" heading={<h2>ダイスロール</h2>}>
			<div className={style['container']}>
				<DiceView className={style['view']} dices={dices} faces={faces} />
				<DiceTypeSelector className={style['selector']} types={PRESETS} selected={type} onTypeChange={this.handleTypeChange} />
				<RollButton className={style['roll']} disabled={!ready} onClick={this.handleRollClick} />
			</div>

			<DiceRollTask active={rolling} dices={dices} faces={faces} callback={this.updateFaces} />
			<CustomDiceDialog open={openCustomDiceDialog} {...custom} onClose={this.handleClose} />
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
		this.setState({ rolling: true });
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

	private updateFaces(faces: number[], final: boolean): void {
		this.setState({ faces, rolling: !final });
	}

	private reset(): void {
		this.setState(({ type, custom }) => {
			const dices = this.getDices(type, custom);
			const faces = dices.map(dice => dice.default);
			return { faces, rolling: false };
		});
	}

	private getDices(type: string | undefined, custom: CustomDiceConfig): Dice[] {
		if (type === undefined) {
			return [];
		} else if (type !== 'custom') {
			return Dice.parse(type);
		} else {
			return Dice.create(custom.count, custom.max);
		}
	}
}