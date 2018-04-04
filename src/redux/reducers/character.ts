import { Map } from 'immutable';
import { Character } from "models/status";
import { Action } from "redux/actions/root";
import { CHARACTER_SET, CHARACTER_DELETE } from "redux/actions/character";

export interface CharacterState {
	characters: Map<string, Character>;
}

export function CharacterReducer(state: CharacterState = { characters: Map() }, action: Action): CharacterState {
	switch (action.type) {
		case CHARACTER_SET:
			{
				const { character } = action;
				const array = Array.isArray(character) ? character : [character];

				return { characters: state.characters.withMutations(s => array.forEach(char => s.set(char.uuid, char))) };
			}
		case CHARACTER_DELETE:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return { characters: state.characters.withMutations(s => array.forEach(uuid => s.delete(uuid))) };
			}
		default:
			return state;
	}
}