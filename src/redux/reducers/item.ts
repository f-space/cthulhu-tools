import { Map } from 'immutable';
import { Item } from "models/status";
import { Action } from "redux/actions/root";
import { ITEM_SET, ITEM_DELETE } from "redux/actions/item";

export interface ItemState {
	items: Map<string, Item>;
}

export function ItemReducer(state: ItemState = { items: Map() }, action: Action): ItemState {
	switch (action.type) {
		case ITEM_SET:
			return { items: state.items.set(action.item.uuid, action.item) };
		case ITEM_DELETE:
			return { items: state.items.delete(action.uuid) };
		default:
			return state;
	}
}