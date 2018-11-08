import { connect } from 'react-redux';
import { State } from "redux/store";
import { getMuted } from "redux/selectors/config";
import { DiceRollTask, DiceRollTaskProps } from "../functions/dice-roll-task";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

const mapStateToProps = (state: State) => {
	return { muted: getMuted(state) };
}

export interface DiceRollProps extends Omit<DiceRollTaskProps, 'muted'> { }

export const DiceRoll = connect(mapStateToProps)(DiceRollTask);