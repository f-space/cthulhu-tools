import Vue from 'vue';
import { CharacterView, Character, CharacterProvider } from "models/status";
import DB from "models/storage";
import { Module, Getter, Mutation, Action } from "modules/vuex-class-module";

type CharacterTable = { [uuid: string]: Character };

@Module({ namespaced: true })
export default class CharacterModule implements CharacterProvider {
	public characters: CharacterTable = Object.create(null);

	@Getter
	public get provider(): CharacterProvider { return this; }

	@Mutation
	public set_character(character: Character): void {
		Vue.set(this.characters, character.uuid, character);
	}

	@Mutation
	public delete_character(uuid: string): void {
		Vue.delete(this.characters, uuid);
	}

	@Action
	public async create(character: Character): Promise<void> {
		const view = new CharacterView({ target: character.uuid });
		await DB.transaction("rw", DB.characters, DB.views, () => {
			return DB.characters.add(character.toJSON()).then(() => {
				return DB.views.add(view.toJSON());
			});
		}).then(() => {
			this.set_character(character);
		});
	}

	@Action
	public async update(character: Character): Promise<void> {
		await DB.transaction("rw", DB.characters, () => {
			return DB.characters.update(character.uuid, character.toJSON());
		}).then(() => {
			this.set_character(character);
		});
	}

	@Action
	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.characters, DB.views, () => {
			return DB.characters.delete(uuid).then(() => {
				return DB.views.delete(uuid);
			});
		}).then(() => {
			this.delete_character(uuid);
		});
	}

	@Action
	public async load(): Promise<void> {
		await DB.transaction("r", DB.characters, () => {
			return DB.characters.toArray();
		}).then(characters => {
			for (const character of characters) {
				this.set_character(new Character(character));
			}
		});
	}

	public get(uuid: string): Character | undefined;
	public get(uuids: string[]): Character[];
	public get(uuids: string | string[]): Character | Character[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.characters[uuid]).filter(x => x !== undefined)
			: this.characters[uuids];
	}

	public list(): Character[] { return Object.values(this.characters); }
}