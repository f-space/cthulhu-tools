import { Character } from "models/status";

export const CHARACTER_SET = "character/set";
export const CHARACTER_DELETE = "character/delete";

export interface CharacterSetAction {
	readonly type: typeof CHARACTER_SET;
	readonly character: Character;
}

export interface CharacterDeleteAction {
	readonly type: typeof CHARACTER_DELETE;
	readonly uuid: string;
}

export type CharacterAction = CharacterSetAction | CharacterDeleteAction;

export function setCharacter(character: Character): CharacterSetAction {
	return {
		type: CHARACTER_SET,
		character,
	};
}

export function deleteCharacter(uuid: string): CharacterDeleteAction {
	return {
		type: CHARACTER_DELETE,
		uuid,
	};
}