import { Map } from 'immutable';
import { Character } from "models/status";
import { Action } from "redux/actions/root";
import { CharacterActionType, LoadState } from "redux/actions/character";

export interface CharacterState {
	characters: Map<string, Character>;
	loadState: LoadState;
}

export const INITIAL_STATE: CharacterState = {
	characters: Map(),
	loadState: 'unloaded',
};

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