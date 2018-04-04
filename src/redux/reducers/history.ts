import { Map } from 'immutable';
import { History } from "models/status";
import { Action } from "redux/actions/root";
import { HistoryActionType } from "redux/actions/history";

export interface HistoryState {
	histories: Map<string, History>;
}

export function HistoryReducer(state: HistoryState = { histories: Map() }, action: Action): HistoryState {
	switch (action.type) {
		case HistoryActionType.Set:
			{
				const { history } = action;
				const array = Array.isArray(history) ? history : [history];

				return { histories: state.histories.withMutations(s => array.forEach(hist => s.set(hist.uuid, hist))) };
			}
		case HistoryActionType.Delete:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return { histories: state.histories.withMutations(s => array.forEach(uuid => s.delete(uuid))) };
			}
		default:
			return state;
	}
}