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
			return { characters: state.characters.set(action.character.uuid, action.character) };
		case CHARACTER_DELETE:
			return { characters: state.characters.delete(action.uuid) };
		default:
			return state;
	}
}