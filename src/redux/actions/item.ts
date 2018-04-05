import { Item } from "models/status";
import { LoadState } from "redux/states/item";

export enum ItemActionType {
	Set = '[item]::set',
	Delete = '[item]::delete',
	SetLoadState = '[item]::setLoadState',
}

export interface ItemSetAction {
	readonly type: ItemActionType.Set;
	readonly item: Item | Item[];
}

export interface ItemDeleteAction {
	readonly type: ItemActionType.Delete;
	readonly uuid: string | string[];
}

export interface ItemSetLoadStateAction {
	readonly type: ItemActionType.SetLoadState;
	readonly state: LoadState;
}

export type ItemAction =
	| ItemSetAction
	| ItemDeleteAction
	| ItemSetLoadStateAction

export const ItemAction = {
	set(item: Item | Item[]): ItemSetAction {
		return { type: ItemActionType.Set, item };
	},
	delete(uuid: string | string[]): ItemDeleteAction {
		return { type: ItemActionType.Delete, uuid };
	},
	setLoadState(state: LoadState): ItemSetLoadStateAction {
		return { type: ItemActionType.SetLoadState, state };
	},
}