import { History } from "models/status";

export const HISTORY_SET = "history/set";
export const HISTORY_DELETE = "history/delete";

export interface HistorySetAction {
	readonly type: typeof HISTORY_SET;
	readonly history: History | History[];
}

export interface HistoryDeleteAction {
	readonly type: typeof HISTORY_DELETE;
	readonly uuid: string | string[];
}

export type HistoryAction = HistorySetAction | HistoryDeleteAction;

export function setHistory(history: History | History[]): HistorySetAction {
	return {
		type: HISTORY_SET,
		history,
	};
}

export function deleteHistory(uuid: string | string[]): HistoryDeleteAction {
	return {
		type: HISTORY_DELETE,
		uuid,
	};
}