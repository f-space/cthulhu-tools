import { LoadState } from "redux/states/status";
import { ViewAction } from "redux/actions/view";
import { CharacterAction } from "redux/actions/character";
import { ProfileAction } from "redux/actions/profile";
import { AttributeAction } from "redux/actions/attribute";
import { SkillAction } from "redux/actions/skill";
import { ItemAction } from "redux/actions/item";
import { HistoryAction } from "redux/actions/history";

export enum StatusActionType {
	SetLoadState = '[status]::setLoadState',
}

export interface StatusSetLoadStateAction {
	readonly type: StatusActionType.SetLoadState;
	readonly state: LoadState;
}

export type StatusAction =
	| ViewAction
	| CharacterAction
	| ProfileAction
	| AttributeAction
	| SkillAction
	| ItemAction
	| HistoryAction
	| StatusSetLoadStateAction;

export const StatusAction = {
	setLoadState(state: LoadState): StatusSetLoadStateAction {
		return { type: StatusActionType.SetLoadState, state };
	},
}