import { Map } from 'immutable';
import { Character } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export interface CharacterState {
	characters: Map<string, Character>;
	loadState: LoadState;
}

export const INITIAL_STATE: CharacterState = {
	characters: Map(),
	loadState: 'unloaded',
};
