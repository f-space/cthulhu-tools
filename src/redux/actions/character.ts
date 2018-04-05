import { Character } from "models/status";
import { LoadState } from "redux/states/character";

export enum CharacterActionType {
	Set = '[character]::set',
	Delete = '[character]::delete',
	SetLoadState = '[character]::setLoadState',
}

export interface CharacterSetAction {
	readonly type: CharacterActionType.Set;
	readonly character: Character | Character[];
}

export interface CharacterDeleteAction {
	readonly type: CharacterActionType.Delete;
	readonly uuid: string | string[];
}

export interface CharacterSetLoadStateAction {
	readonly type: CharacterActionType.SetLoadState;
	readonly state: LoadState;
}

export type CharacterAction =
	| CharacterSetAction
	| CharacterDeleteAction
	| CharacterSetLoadStateAction

export const CharacterAction = {
	set(character: Character | Character[]): CharacterSetAction {
		return { type: CharacterActionType.Set, character };
	},
	delete(uuid: string | string[]): CharacterDeleteAction {
		return { type: CharacterActionType.Delete, uuid };
	},
	setLoadState(state: LoadState): CharacterSetLoadStateAction {
		return { type: CharacterActionType.SetLoadState, state };
	},
}