import { Character } from "models/status";

export const CHARACTER_SET = "character/set";
export const CHARACTER_DELETE = "character/delete";

export interface CharacterSetAction {
	readonly type: typeof CHARACTER_SET;
	readonly character: Character | Character[];
}

export interface CharacterDeleteAction {
	readonly type: typeof CHARACTER_DELETE;
	readonly uuid: string | string[];
}

export type CharacterAction = CharacterSetAction | CharacterDeleteAction;

export function setCharacter(character: Character | Character[]): CharacterSetAction {
	return {
		type: CHARACTER_SET,
		character,
	};
}

export function deleteCharacter(uuid: string | string[]): CharacterDeleteAction {
	return {
		type: CHARACTER_DELETE,
		uuid,
	};
}