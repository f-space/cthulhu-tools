import { CharacterParamsData, CharacterParams } from "./params";
import { validate } from "./validation";

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

export class Character implements CharacterConfig {
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
			uuid: validate("uuid", uuid).string().uuid().value,
			profile: validate("profile", profile).string().uuid().value,
			history: validate("history", history).optional(v => v.nullable(v => v.string().uuid())).or(null).value,
			params: validate("params", params).optional(v => v.object<CharacterParamsData>()).or({}).map(CharacterParams.from).value,
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