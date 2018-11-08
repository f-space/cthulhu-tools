import { CharacterView } from "models/status";

export enum ViewActionType {
	Set = '[view]::set',
	Delete = '[view]::delete',
}

export interface ViewSetAction {
	readonly type: ViewActionType.Set;
	readonly view: CharacterView | CharacterView[];
}

export interface ViewDeleteAction {
	readonly type: ViewActionType.Delete;
	readonly target: string | string[];
}

export type ViewAction =
	| ViewSetAction
	| ViewDeleteAction

export const ViewAction = {
	set(view: CharacterView | CharacterView[]): ViewSetAction {
		return { type: ViewActionType.Set, view };
	},
	delete(target: string | string[]): ViewDeleteAction {
		return { type: ViewActionType.Delete, target };
	},
}