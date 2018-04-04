import { History } from "models/status";

export enum HistoryActionType {
	Set = '[history]::set',
	Delete = '[history]::delete',
}

export interface HistorySetAction {
	readonly type: HistoryActionType.Set;
	readonly history: History | History[];
}

export interface HistoryDeleteAction {
	readonly type: HistoryActionType.Delete;
	readonly uuid: string | string[];
}

export type HistoryAction =
	| HistorySetAction
	| HistoryDeleteAction

export const HistoryAction = {
	set(history: History | History[]): HistorySetAction {
		return { type: HistoryActionType.Set, history };
	},
	delete(uuid: string | string[]): HistoryDeleteAction {
		return { type: HistoryActionType.Delete, uuid };
	},
}