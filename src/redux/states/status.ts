import { ViewState, INITIAL_VIEW_STATE } from "redux/states/view";
import { CharacterState, INITIAL_CHARACTER_STATE } from "redux/states/character";
import { ProfileState, INITIAL_PROFILE_STATE } from "redux/states/profile";
import { AttributeState, INITIAL_ATTRIBUTE_STATE } from "redux/states/attribute";
import { SkillState, INITIAL_SKILL_STATE } from "redux/states/skill";
import { ItemState, INITIAL_ITEM_STATE } from "redux/states/item";
import { HistoryState, INITIAL_HISTORY_STATE } from "redux/states/history";

export type LoadState = 'unloaded' | 'loading' | 'loaded' | 'error';

export interface StatusState {
	view: ViewState;
	character: CharacterState;
	profile: ProfileState;
	attribute: AttributeState;
	skill: SkillState;
	item: ItemState;
	history: HistoryState;
	loadState: LoadState;
}

export const INITIAL_STATE: StatusState = {
	view: INITIAL_VIEW_STATE,
	character: INITIAL_CHARACTER_STATE,
	profile: INITIAL_PROFILE_STATE,
	attribute: INITIAL_ATTRIBUTE_STATE,
	skill: INITIAL_SKILL_STATE,
	item: INITIAL_ITEM_STATE,
	history: INITIAL_HISTORY_STATE,
	loadState: 'unloaded',
};