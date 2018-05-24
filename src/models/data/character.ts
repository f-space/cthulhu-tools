import { CharacterParams } from "./params";
import * as validation from "./validation";

export interface CharacterData {
	readonly uuid?: string;
	readonly profile: string;
	readonly history?: string | null;
	readonly params?: Partial<CharacterParams>;
}

export class Character {
	public readonly uuid: string;
	public readonly profile: string;
	public readonly history: string | null;
	public readonly params: CharacterParams;
	public readonly readonly: boolean;

	public constructor({ uuid, profile, history, params }: CharacterData, readonly?: boolean) {
		this.uuid = validation.uuid(uuid);
		this.profile = validation.string(profile);
		this.history = validation.string_null(history);
		this.params = validation.props(params, {
			attribute: validation.plainObject,
			skill: validation.plainObject,
			item: validation.plainObject,
		});
		this.readonly = Boolean(readonly);
	}

	public toJSON(): CharacterData {
		return {
			uuid: this.uuid,
			profile: this.profile,
			history: this.history,
			params: this.params,
		};
	}
}