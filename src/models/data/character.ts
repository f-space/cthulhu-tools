import { CharacterParamsData, CharacterParams } from "./params";
import * as validation from "./validation";

export interface CharacterData {
	readonly uuid: string;
	readonly profile: string;
	readonly history?: string | null;
	readonly params?: CharacterParamsData;
}

export interface CharacterConfig {
	readonly uuid: string;
	readonly profile: string;
	readonly history: string | null;
	readonly params: CharacterParams;
}

export class Character {
	public readonly uuid: string;
	public readonly profile: string;
	public readonly history: string | null;
	public readonly params: CharacterParams;
	public readonly readonly: boolean;

	public constructor({ uuid, profile, history, params }: CharacterConfig, readonly?: boolean) {
		this.uuid = uuid;
		this.profile = profile;
		this.history = history;
		this.params = params;
		this.readonly = Boolean(readonly);
	}

	public static from({ uuid, profile, history, params }: CharacterData, readonly?: boolean) {
		return new Character({
			uuid: validation.uuid(uuid),
			profile: validation.string(profile),
			history: validation.string_null(history),
			params: CharacterParams.from(validation.or(params, {})),
		}, readonly);
	}

	public toJSON(): CharacterData {
		return {
			uuid: this.uuid,
			profile: this.profile,
			history: this.history,
			params: this.params.toJSON(),
		};
	}

	public set(config: Partial<CharacterConfig>): Character {
		const { uuid, profile, history, params } = this;

		return new Character({ uuid, profile, history, params, ...config });
	}
}