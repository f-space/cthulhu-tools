import { HistoryState, INITIAL_STATE } from "redux/states/history";
import { Action } from "redux/actions/root";
import { HistoryActionType } from "redux/actions/history";

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