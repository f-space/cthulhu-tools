import { Map } from 'immutable';
import { CharacterView } from "models/status";
import { Action } from "redux/actions/root";
import { VIEW_SET, VIEW_DELETE } from "redux/actions/view";

export interface ViewState {
	views: Map<string, CharacterView>;
}

export function ViewReducer(state: ViewState = { views: Map() }, action: Action): ViewState {
	switch (action.type) {
		case VIEW_SET:
			{
				const { view } = action;
				const array = Array.isArray(view) ? view : [view];

				return { views: state.views.withMutations(s => array.forEach(view => s.set(view.target, view))) };
			}
		case VIEW_DELETE:
			{
				const { target } = action;
				const array = Array.isArray(target) ? target : [target];

				return { views: state.views.withMutations(s => array.forEach(target => s.delete(target))) };
			}
		default:
			return state;
	}
}