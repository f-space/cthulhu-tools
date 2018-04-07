import { Map } from 'immutable';
import { CharacterView } from "models/status";

export interface ViewState {
	views: Map<string, CharacterView>;
}

export const INITIAL_VIEW_STATE: ViewState = {
	views: Map(),
};