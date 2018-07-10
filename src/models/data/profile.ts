import { validate } from "./validation";

export interface ProfileData {
	readonly uuid: string;
	readonly name: string;
	readonly base?: string;
	readonly attributes?: ReadonlyArray<string>;
	readonly skills?: ReadonlyArray<string>;
}

export interface ProfileConfig {
	readonly uuid: string;
	readonly name: string;
	readonly base?: string;
	readonly attributes?: ReadonlyArray<string>;
	readonly skills?: ReadonlyArray<string>;
}

export class Profile implements ProfileConfig {
	public readonly uuid: string;
	public readonly name: string;
	public readonly base?: string;
	public readonly attributes: ReadonlyArray<string>;
	public readonly skills: ReadonlyArray<string>;
	public readonly readonly: boolean;

	public constructor({ uuid, name, base, attributes, skills }: ProfileConfig, readonly?: boolean) {
		this.uuid = uuid;
		this.name = name;
		this.base = base;
		this.attributes = attributes !== undefined ? attributes : [];
		this.skills = skills !== undefined ? skills : [];
		this.readonly = Boolean(readonly);
	}

	public static from({ uuid, name, base, attributes, skills }: ProfileData, readonly?: boolean) {
		return new Profile({
			uuid: validate("uuid", uuid).string().uuid().value,
			name: validate("name", name).string().nonempty().value,
			base: validate("base", base).optional(v => v.string().uuid()).value,
			attributes: validate("attributes", attributes).optional(v => v.array(v => v.string().uuid())).value,
			skills: validate("skills", skills).optional(v => v.array(v => v.string().uuid())).value,
		}, readonly);
	}

	public toJSON(): ProfileData {
		return {
			uuid: this.uuid,
			name: this.name,
			base: this.base,
			attributes: this.attributes.length !== 0 ? this.attributes : undefined,
			skills: this.skills.length !== 0 ? this.skills : undefined,
		};
	}

	public set(config: Partial<ProfileConfig>, readonly?: boolean): Profile {
		const { uuid, name, base, attributes, skills } = this;

		return new Profile({ uuid, name, base, attributes, skills, ...config }, readonly);
	}
}