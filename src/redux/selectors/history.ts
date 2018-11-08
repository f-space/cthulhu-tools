import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { History, HistoryProvider } from "models/status";
import { State } from "redux/store";

class Provider implements HistoryProvider {
	constructor(readonly histories: Map<string, History>) { }

	public get(uuid: string): History | undefined;
	public get(uuids: string[]): History[];
	public get(uuids: string | string[]): History | History[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.histories.get(uuid)).filter(x => x !== undefined) as History[]
			: this.histories.get(uuids);
	}

	public list(): History[] { return [...this.histories.values()]; }
}

export const getHistoryState = (state: State) => state.status.history;

export const getHistories = createSelector(getHistoryState, state => state.histories);

export const getHistoryProvider = createSelector(getHistories, histories => new Provider(histories));
