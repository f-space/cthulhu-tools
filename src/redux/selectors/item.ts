import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Item, ItemProvider } from "models/status";
import { ItemState } from "redux/reducers/item";

class Provider implements ItemProvider {
	constructor(readonly items: Map<string, Item>) { }

	public get(uuid: string): Item | undefined;
	public get(uuids: string[]): Item[];
	public get(uuids: string | string[]): Item | Item[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.items.get(uuid)).filter(x => x !== undefined)
			: this.items.get(uuids);
	}

	public list(): Item[] { return [...this.items.values() as IterableIterator<Item>]; }
}

export const getItemProvider = createSelector(
	(state: ItemState) => state.items,
	(items) => new Provider(items)
);
