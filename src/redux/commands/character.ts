import { CharacterView, Character } from "models/status";
import DB from "models/storage";
import { Store } from "redux/reducers/root";
import { setCharacter, deleteCharacter } from "redux/actions/character";

export default class CharacterCommand {
	public constructor(readonly store: Store) { }

	public async create(character: Character): Promise<void> {
		const view = new CharacterView({ target: character.uuid });
		await DB.transaction("rw", DB.characters, DB.views, () => {
			return DB.characters.add(character.toJSON()).then(() => {
				return DB.views.add(view.toJSON());
			});
		}).then(() => {
			this.store.dispatch(setCharacter(character));
		});
	}

	public async update(character: Character): Promise<void> {
		await DB.transaction("rw", DB.characters, () => {
			return DB.characters.update(character.uuid, character.toJSON());
		}).then(() => {
			this.store.dispatch(setCharacter(character));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.characters, DB.views, () => {
			return DB.characters.delete(uuid).then(() => {
				return DB.views.delete(uuid);
			});
		}).then(() => {
			this.store.dispatch(deleteCharacter(uuid));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.characters, () => {
			return DB.characters.toArray();
		}).then(characters => {
			for (const character of characters) {
				this.store.dispatch(setCharacter(new Character(character)));
			}
		});
	}
}