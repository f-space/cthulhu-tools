import { Map } from 'immutable';
import { CharacterView } from "models/status";
import { Action } from "redux/actions/root";
import { ViewActionType, LoadState } from "redux/actions/view";

export interface ViewState {
	views: Map<string, CharacterView>;
	loadState: LoadState;
}

export const INITIAL_STATE: ViewState = {
	views: Map(),
	loadState: 'unloaded',
};

export function ViewReducer(state: ViewState = INITIAL_STATE, action: Action): ViewState {
	switch (action.type) {
		case ViewActionType.Set:
			{
				const { view } = action;
				const array = Array.isArray(view) ? view : [view];

				return {
					...state,
					views: state.views.withMutations(s => array.forEach(view => s.set(view.target, view))),
				};
			}
		case ViewActionType.Delete:
			{
				const { target } = action;
				const array = Array.isArray(target) ? target : [target];

				return {
					...state,
					views: state.views.withMutations(s => array.forEach(target => s.delete(target))),
				};
			}
		case ViewActionType.SetLoadState:
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