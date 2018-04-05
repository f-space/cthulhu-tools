import { Map } from 'immutable';
import { CharacterView } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export interface ViewState {
	views: Map<string, CharacterView>;
	loadState: LoadState;
}

export const INITIAL_STATE: ViewState = {
	views: Map(),
	loadState: 'unloaded',
};