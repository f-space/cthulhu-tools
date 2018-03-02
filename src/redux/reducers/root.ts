import { Action } from "redux/actions/root";
import { ViewState, ViewReducer } from "redux/reducers/view";
import { CharacterState, CharacterReducer } from "redux/reducers/character";
import { ProfileState, ProfileReducer } from "redux/reducers/profile";
import { AttributeState, AttributeReducer } from "redux/reducers/attribute";
import { SkillState, SkillReducer } from "redux/reducers/skill";
import { ItemState, ItemReducer } from "redux/reducers/item";
import { HistoryState, HistoryReducer } from "redux/reducers/history";
import combine from "redux/utilities/combine";

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
});