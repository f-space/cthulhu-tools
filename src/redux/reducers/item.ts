import { ItemState, INITIAL_ITEM_STATE } from "redux/states/item";
import { Action } from "redux/actions/root";
import { ItemActionType } from "redux/actions/item";

export function ItemReducer(state: ItemState = INITIAL_ITEM_STATE, action: Action): ItemState {
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
		default:
			return state;
	}
}