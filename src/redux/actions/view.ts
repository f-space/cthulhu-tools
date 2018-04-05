import { CharacterView } from "models/status";
import { LoadState } from "redux/states/view";

export enum ViewActionType {
	Set = '[view]::set',
	Delete = '[view]::delete',
	SetLoadState = '[view]::setLoadState',
}

export interface ViewSetAction {
	readonly type: ViewActionType.Set;
	readonly view: CharacterView | CharacterView[];
}

export interface ViewDeleteAction {
	readonly type: ViewActionType.Delete;
	readonly target: string | string[];
}

export interface ViewSetLoadStateAction {
	readonly type: ViewActionType.SetLoadState;
	readonly state: LoadState;
}

export type ViewAction =
	| ViewSetAction
	| ViewDeleteAction
	| ViewSetLoadStateAction

export const ViewAction = {
	set(view: CharacterView | CharacterView[]): ViewSetAction {
		return { type: ViewActionType.Set, view };
	},
	delete(target: string | string[]): ViewDeleteAction {
		return { type: ViewActionType.Delete, target };
	},
	setLoadState(state: LoadState): ViewSetLoadStateAction {
		return { type: ViewActionType.SetLoadState, state };
	},
}