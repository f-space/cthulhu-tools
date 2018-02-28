import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Character, CharacterProvider } from "models/status";
import { CharacterState } from "redux/reducers/character";

class Provider implements CharacterProvider {
	constructor(readonly characters: Map<string, Character>) { }

	public get(uuid: string): Character | undefined;
	public get(uuids: string[]): Character[];
	public get(uuids: string | string[]): Character | Character[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.characters.get(uuid)).filter(x => x !== undefined) as Character[]
			: this.characters.get(uuids);
	}

	public list(): Character[] { return [...this.characters.values()]; }
}

export const getCharacterProvider = createSelector(
	(state: CharacterState) => state.characters,
	(characters) => new Provider(characters)
);
