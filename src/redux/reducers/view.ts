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
			return { views: state.views.set(action.view.target, action.view) };
		case VIEW_DELETE:
			return { views: state.views.delete(action.target) };
		default:
			return state;
	}
}