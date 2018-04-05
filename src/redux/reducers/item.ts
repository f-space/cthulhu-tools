import { Map } from 'immutable';
import { Item } from "models/status";
import { Action } from "redux/actions/root";
import { ItemActionType, LoadState } from "redux/actions/item";

export interface ItemState {
	items: Map<string, Item>;
	loadState: LoadState;
}

export const INITIAL_STATE: ItemState = {
	items: Map(),
	loadState: 'unloaded',
};

export function ItemReducer(state: ItemState = INITIAL_STATE, action: Action): ItemState {
	switch (action.type) {
		case ItemActionType.Set:
			{
				const { item } = action;
				const array = Array.isArray(item) ? item : [item];

				return {
					...state,
					items: state.items.withMutations(s => array.forEach(item => s.set(item.uuid, item))),
				};
			}
		case ItemActionType.Delete:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return {
					...state,
					items: state.items.withMutations(s => array.forEach(uuid => s.delete(uuid))),
				};
			}
		case ItemActionType.SetLoadState:
			{
				const { state: loadState } = action;

				return {
					...state,
					loadState,
				};
			}
		default:
			return state;
	}
}