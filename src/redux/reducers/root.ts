import { Store as ReduxStore, Reducer as ReduxReducer } from 'redux';
import { Action } from "redux/actions/root";
import { ViewState, ViewReducer } from "./view";
import { CharacterState, CharacterReducer } from "./character";
import { ProfileState, ProfileReducer } from "./profile";
import { AttributeState, AttributeReducer } from "./attribute";
import { SkillState, SkillReducer } from "./skill";
import { ItemState, ItemReducer } from "./item";
import { HistoryState, HistoryReducer } from "./history";
import combine from "redux/utilities/combine";

export type Store = ReduxStore<State>;

export interface State {
	view: ViewState;
	character: CharacterState;
	profile: ProfileState;
	attribute: AttributeState;
	skill: SkillState;
	item: ItemState;
	history: HistoryState;
}

export const Reducer = combine<State, Action>({
	view: ViewReducer,
	character: CharacterReducer,
	profile: ProfileReducer,
	attribute: AttributeReducer,
	skill: SkillReducer,
	item: ItemReducer,
	history: HistoryReducer,
}) as ReduxReducer<State>;