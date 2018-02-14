import { Item } from "models/status";

export const ITEM_SET = "item/set";
export const ITEM_DELETE = "item/delete";

export interface ItemSetAction {
	readonly type: typeof ITEM_SET;
	readonly item: Item;
}

export interface ItemDeleteAction {
	readonly type: typeof ITEM_DELETE;
	readonly uuid: string;
}

export type ItemAction = ItemSetAction | ItemDeleteAction;

export function setItem(item: Item): ItemSetAction {
	return {
		type: ITEM_SET,
		item,
	};
}

export function deleteItem(uuid: string): ItemDeleteAction {
	return {
		type: ITEM_DELETE,
		uuid,
	};
}