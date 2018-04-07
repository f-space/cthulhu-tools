import { Map } from 'immutable';
import { Item } from "models/status";

export interface ItemState {
	items: Map<string, Item>;
}

export const INITIAL_ITEM_STATE: ItemState = {
	items: Map(),
};