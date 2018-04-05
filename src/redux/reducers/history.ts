import { Map } from 'immutable';
import { History } from "models/status";
import { Action } from "redux/actions/root";
import { HistoryActionType, LoadState } from "redux/actions/history";

export interface HistoryState {
	histories: Map<string, History>;
	loadState: LoadState;
}

export const INITIAL_STATE: HistoryState = {
	histories: Map(),
	loadState: 'unloaded',
};

export function HistoryReducer(state: HistoryState = INITIAL_STATE, action: Action): HistoryState {
	switch (action.type) {
		case HistoryActionType.Set:
			{
				const { history } = action;
				const array = Array.isArray(history) ? history : [history];

				return {
					...state,
					histories: state.histories.withMutations(s => array.forEach(hist => s.set(hist.uuid, hist))),
				};
			}
		case HistoryActionType.Delete:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return {
					...state,
					histories: state.histories.withMutations(s => array.forEach(uuid => s.delete(uuid))),
				};
			}
		case HistoryActionType.SetLoadState:
			{
				const { state: loadState } = action;

				return {
					...state,
					loadState,
				};
			}
		default:
			return state;
	}
}