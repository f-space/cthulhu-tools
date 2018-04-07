import { Character } from "models/status";

export enum CharacterActionType {
	Set = '[character]::set',
	Delete = '[character]::delete',
}

export interface CharacterSetAction {
	readonly type: CharacterActionType.Set;
	readonly character: Character | Character[];
}

export interface CharacterDeleteAction {
	readonly type: CharacterActionType.Delete;
	readonly uuid: string | string[];
}

export type CharacterAction =
	| CharacterSetAction
	| CharacterDeleteAction

export const CharacterAction = {
	set(character: Character | Character[]): CharacterSetAction {
		return { type: CharacterActionType.Set, character };
	},
	delete(uuid: string | string[]): CharacterDeleteAction {
		return { type: CharacterActionType.Delete, uuid };
	},
}