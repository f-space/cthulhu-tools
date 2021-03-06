import React from 'react';
import { Dice } from "models/dice";
import { DiceRoll, UniformDiceRoll } from "models/dice-roll";
import { DiceSoundPlayer } from "models/dice-sound";
import { RepeatTask } from "./repeat-task";

export interface DiceRollTaskProps {
	active: boolean;
	interval: number;
	iteration: number;
	muted: boolean;
	dices: ReadonlyArray<Dice>;
	faces: ReadonlyArray<number>;
	callback: (faces: number[], final: boolean) => void;
}

export class DiceRollTask extends React.Component<DiceRollTaskProps> {
	public static readonly defaultProps = {
		interval: 100,
		iteration: 10,
		muted: false,
	};

	private sound: DiceSoundPlayer = new DiceSoundPlayer(true);
	private method: DiceRoll = new UniformDiceRoll();

	public constructor(props: DiceRollTaskProps) {
		super(props);

		this.roll = this.roll.bind(this);
	}

	public componentDidMount(): void {
		this.sound.muted = this.props.muted;

		if (this.props.active) this.sound.play();
	}

	public componentWillUnmount(): void {
		this.sound.pause();
	}

	public componentDidUpdate(prevProps: DiceRollTaskProps): void {
		this.sound.muted = this.props.muted;

		if (this.props.active && !prevProps.active) {
			this.sound.play();
		}
	}

	public render() {
		const { active, interval } = this.props;

		return <RepeatTask active={active} interval={interval} callback={this.roll} />
	}

	private roll(n: number): void {
		const { iteration, dices, faces, callback } = this.props;
		if (n < iteration - 1) {
			callback(this.method.next(dices, faces), false);
		} else {
			callback(this.method.last(dices), true);
		}
	}
}