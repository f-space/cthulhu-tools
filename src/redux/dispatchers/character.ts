import { CharacterView, CharacterData, Character } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { CharacterAction } from "redux/actions/character";

export default class CharacterDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(character: Character): Promise<void> {
		const view = new CharacterView({ target: character.uuid, visible: true });
		await DB.transaction("rw", DB.characters, DB.views, () => {
			return DB.characters.add(character.toJSON()).then(() => {
				return DB.views.add(view.toJSON());
			});
		}).then(() => {
			this.dispatch(CharacterAction.set(character));
		});
	}

	public async update(character: Character): Promise<void> {
		await DB.transaction("rw", DB.characters, () => {
			return DB.characters.update(character.uuid, character.toJSON());
		}).then(() => {
			this.dispatch(CharacterAction.set(character));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.characters, DB.views, () => {
			return DB.characters.delete(uuid).then(() => {
				return DB.views.delete(uuid);
			});
		}).then(() => {
			this.dispatch(CharacterAction.delete(uuid));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.characters, () => {
			return DB.characters.toArray();
		}).then(characters => {
			this.dispatch(CharacterAction.set(this.validate(characters)));
		});
	}

	private validate(characters: ReadonlyArray<CharacterData>, readonly?: boolean): Character[] {
		const result = [] as Character[];
		for (const character of characters) {
			try {
				result.push(Character.from(character, readonly));
			} catch (e) {
				if (e instanceof Error) {
					console.error(`Failed to load a character: ${e.message}`);
				} else throw e;
			}
		}
		return result;
	}
}