import { ViewState, INITIAL_VIEW_STATE } from "redux/states/view";
import { Action } from "redux/actions/root";
import { ViewActionType } from "redux/actions/view";

export function ViewReducer(state: ViewState = INITIAL_VIEW_STATE, action: Action): ViewState {
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
		default:
			return state;
	}
}