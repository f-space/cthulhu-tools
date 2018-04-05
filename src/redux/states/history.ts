import { Map } from 'immutable';
import { History } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export interface HistoryState {
	histories: Map<string, History>;
	loadState: LoadState;
}

export const INITIAL_STATE: HistoryState = {
	histories: Map(),
	loadState: 'unloaded',
};