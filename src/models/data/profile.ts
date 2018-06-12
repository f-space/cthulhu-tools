import * as validation from "./validation";

export interface ProfileData {
	readonly uuid: string;
	readonly name: string;
	readonly attributes?: ReadonlyArray<string>;
	readonly skills?: ReadonlyArray<string>;
}

export interface ProfileConfig {
	readonly uuid: string;
	readonly name: string;
	readonly attributes?: ReadonlyArray<string>;
	readonly skills?: ReadonlyArray<string>;
}

export class Profile {
	public readonly uuid: string;
	public readonly name: string;
	public readonly attributes: ReadonlyArray<string>;
	public readonly skills: ReadonlyArray<string>;
	public readonly readonly: boolean;

	public constructor({ uuid, name, attributes, skills }: ProfileConfig, readonly?: boolean) {
		this.uuid = uuid;
		this.name = name;
		this.attributes = attributes !== undefined ? attributes : [];
		this.skills = skills !== undefined ? skills : [];
		this.readonly = Boolean(readonly);
	}

	public static from({ uuid, name, attributes, skills }: ProfileData, readonly?: boolean) {
		return new Profile({
			uuid: validation.uuid(uuid),
			name: validation.string(name),
			attributes: validation.array(attributes, validation.string),
			skills: validation.array(skills, validation.string),
		}, readonly);
	}

	public toJSON(): ProfileData {
		return {
			uuid: this.uuid,
			name: this.name,
			attributes: this.attributes.length !== 0 ? this.attributes : undefined,
			skills: this.skills.length !== 0 ? this.skills : undefined,
		};
	}

	public set(config: Partial<ProfileConfig>, readonly?: boolean): Profile {
		const { uuid, name, attributes, skills } = this;

		return new Profile({ uuid, name, attributes, skills, ...config }, readonly);
	}
}