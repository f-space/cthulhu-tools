import { Item } from "models/status";

export enum ItemActionType {
	Set = '[item]::set',
	Delete = '[item]::delete',
}

export interface ItemSetAction {
	readonly type: ItemActionType.Set;
	readonly item: Item | Item[];
}

export interface ItemDeleteAction {
	readonly type: ItemActionType.Delete;
	readonly uuid: string | string[];
}

export type ItemAction =
	| ItemSetAction
	| ItemDeleteAction

export const ItemAction = {
	set(item: Item | Item[]): ItemSetAction {
		return { type: ItemActionType.Set, item };
	},
	delete(uuid: string | string[]): ItemDeleteAction {
		return { type: ItemActionType.Delete, uuid };
	},
}