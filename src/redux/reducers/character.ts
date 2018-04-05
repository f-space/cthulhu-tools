import { CharacterState, INITIAL_STATE } from "redux/states/character";
import { Action } from "redux/actions/root";
import { CharacterActionType } from "redux/actions/character";

export function CharacterReducer(state: CharacterState = INITIAL_STATE, action: Action): CharacterState {
	switch (action.type) {
		case CharacterActionType.Set:
			{
				const { character } = action;
				const array = Array.isArray(character) ? character : [character];

				return {
					...state,
					characters: state.characters.withMutations(s => array.forEach(char => s.set(char.uuid, char))),
				};
			}
		case CharacterActionType.Delete:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return {
					...state,
					characters: state.characters.withMutations(s => array.forEach(uuid => s.delete(uuid))),
				};
			}
		case CharacterActionType.SetLoadState:
			{
				const { state: loadState } = action;

				return {
					...state,
					loadState,
				};
			}
		default:
			return state;
	}
}