import { Map } from 'immutable';
import { Character } from "models/status";

export interface CharacterState {
	characters: Map<string, Character>;
}

export const INITIAL_CHARACTER_STATE: CharacterState = {
	characters: Map(),
};
