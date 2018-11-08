import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Item, ItemProvider } from "models/status";
import { State } from "redux/store";

class Provider implements ItemProvider {
	constructor(readonly items: Map<string, Item>) { }

	public get(uuid: string): Item | undefined;
	public get(uuids: string[]): Item[];
	public get(uuids: string | string[]): Item | Item[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.items.get(uuid)).filter(x => x !== undefined) as Item[]
			: this.items.get(uuids);
	}

	public list(): Item[] { return [...this.items.values()]; }
}

export const getItemState = (state: State) => state.status.item;

export const getItems = createSelector(getItemState, state => state.items);

export const getItemProvider = createSelector(getItems, items => new Provider(items));