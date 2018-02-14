import { Map } from 'immutable';
import { History } from "models/status";
import { Action } from "redux/actions/root";
import { HISTORY_SET, HISTORY_DELETE } from "redux/actions/history";

export interface HistoryState {
	histories: Map<string, History>;
}

export function HistoryReducer(state: HistoryState = { histories: Map() }, action: Action): HistoryState {
	switch (action.type) {
		case HISTORY_SET:
			return { histories: state.histories.set(action.history.uuid, action.history) };
		case HISTORY_DELETE:
			return { histories: state.histories.delete(action.uuid) };
		default:
			return state;
	}
}