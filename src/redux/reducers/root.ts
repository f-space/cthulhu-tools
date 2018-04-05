import { combineReducers } from 'redux';
import { State } from "redux/states/root";
import { Action } from "redux/actions/root";
import { ViewReducer } from "redux/reducers/view";
import { CharacterReducer } from "redux/reducers/character";
import { ProfileReducer } from "redux/reducers/profile";
import { AttributeReducer } from "redux/reducers/attribute";
import { SkillReducer } from "redux/reducers/skill";
import { ItemReducer } from "redux/reducers/item";
import { HistoryReducer } from "redux/reducers/history";

export const Reducer = combineReducers<State, Action>({
	view: ViewReducer,
	character: CharacterReducer,
	profile: ProfileReducer,
	attribute: AttributeReducer,
	skill: SkillReducer,
	item: ItemReducer,
	history: HistoryReducer,
});