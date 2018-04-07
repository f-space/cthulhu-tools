import { combineReducers } from 'redux';
import { StatusState, INITIAL_STATE } from "redux/states/status";
import { Action } from "redux/actions/root";
import { StatusActionType } from "redux/actions/status";
import { ViewReducer } from "redux/reducers/view";
import { CharacterReducer } from "redux/reducers/character";
import { ProfileReducer } from "redux/reducers/profile";
import { AttributeReducer } from "redux/reducers/attribute";
import { SkillReducer } from "redux/reducers/skill";
import { ItemReducer } from "redux/reducers/item";
import { HistoryReducer } from "redux/reducers/history";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type PartialStatusState = Omit<StatusState, 'loadState'>;

const PartialStatusReducer = combineReducers<PartialStatusState, Action>({
	view: ViewReducer,
	character: CharacterReducer,
	profile: ProfileReducer,
	attribute: AttributeReducer,
	skill: SkillReducer,
	item: ItemReducer,
	history: HistoryReducer,
});

export function StatusReducer(state: StatusState = INITIAL_STATE, action: Action): StatusState {
	switch (action.type) {
		case StatusActionType.SetLoadState:
			{
				const { state: loadState } = action;

				return {
					...state,
					loadState,
				};
			}
		default:
			{
				const { loadState, ...rest } = state;
				const nextState = PartialStatusReducer(rest, action);

				return state === nextState ? state : { ...state, ...nextState }
			}
	}
}