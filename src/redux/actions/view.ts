import { CharacterView } from "models/status";

export const VIEW_SET = "view/set";
export const VIEW_DELETE = "view/delete";

export interface ViewSetAction {
	readonly type: typeof VIEW_SET;
	readonly view: CharacterView;
}

export interface ViewDeleteAction {
	readonly type: typeof VIEW_DELETE;
	readonly target: string;
}

export type ViewAction = ViewSetAction | ViewDeleteAction;

export function setView(view: CharacterView): ViewSetAction {
	return {
		type: VIEW_SET,
		view,
	};
}

export function deleteView(target: string): ViewDeleteAction {
	return {
		type: VIEW_DELETE,
		target,
	};
}