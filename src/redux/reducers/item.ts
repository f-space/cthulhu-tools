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
			{
				const { item } = action;
				const array = Array.isArray(item) ? item : [item];

				return { items: state.items.withMutations(s => array.forEach(item => s.set(item.uuid, item))) };
			}
		case ITEM_DELETE:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return { items: state.items.withMutations(s => array.forEach(uuid => s.delete(uuid))) };
			}
		default:
			return state;
	}
}