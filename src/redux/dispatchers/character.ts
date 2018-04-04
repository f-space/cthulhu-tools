import { CharacterView, Character } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { setCharacter, deleteCharacter } from "redux/actions/character";

export default class CharacterDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(character: Character): Promise<void> {
		const view = new CharacterView({ target: character.uuid });
		await DB.transaction("rw", DB.characters, DB.views, () => {
			return DB.characters.add(character.toJSON()).then(() => {
				return DB.views.add(view.toJSON());
			});
		}).then(() => {
			this.dispatch(setCharacter(character));
		});
	}

	public async update(character: Character): Promise<void> {
		await DB.transaction("rw", DB.characters, () => {
			return DB.characters.update(character.uuid, character.toJSON());
		}).then(() => {
			this.dispatch(setCharacter(character));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.characters, DB.views, () => {
			return DB.characters.delete(uuid).then(() => {
				return DB.views.delete(uuid);
			});
		}).then(() => {
			this.dispatch(deleteCharacter(uuid));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.characters, () => {
			return DB.characters.toArray();
		}).then(characters => {
			this.dispatch(setCharacter(characters.map(character => new Character(character))));
		});
	}
}