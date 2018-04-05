import { History } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export enum HistoryActionType {
	Set = '[history]::set',
	Delete = '[history]::delete',
	SetLoadState = '[history]::setLoadState',
}

export interface HistorySetAction {
	readonly type: HistoryActionType.Set;
	readonly history: History | History[];
}

export interface HistoryDeleteAction {
	readonly type: HistoryActionType.Delete;
	readonly uuid: string | string[];
}

export interface HistorySetLoadStateAction {
	readonly type: HistoryActionType.SetLoadState;
	readonly state: LoadState;
}

export type HistoryAction =
	| HistorySetAction
	| HistoryDeleteAction
	| HistorySetLoadStateAction

export const HistoryAction = {
	set(history: History | History[]): HistorySetAction {
		return { type: HistoryActionType.Set, history };
	},
	delete(uuid: string | string[]): HistoryDeleteAction {
		return { type: HistoryActionType.Delete, uuid };
	},
	setLoadState(state: LoadState): HistorySetLoadStateAction {
		return { type: HistoryActionType.SetLoadState, state };
	},
}