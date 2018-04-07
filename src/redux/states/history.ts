import { Map } from 'immutable';
import { History } from "models/status";

export interface HistoryState {
	histories: Map<string, History>;
}

export const INITIAL_HISTORY_STATE: HistoryState = {
	histories: Map(),
};