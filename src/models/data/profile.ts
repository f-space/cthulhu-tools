import * as validation from "./validation";

export interface ProfileData {
	readonly uuid?: string;
	readonly version?: number;
	readonly name: string;
	readonly attributes?: ReadonlyArray<string>;
	readonly skills?: ReadonlyArray<string>;
}

export class Profile {
	public readonly uuid: string;
	public readonly version: number;
	public readonly name: string;
	public readonly attributes: ReadonlyArray<string>;
	public readonly skills: ReadonlyArray<string>;
	public readonly readonly: boolean;

	public constructor({ uuid, version, name, attributes, skills }: ProfileData, readonly?: boolean) {
		this.uuid = validation.uuid(uuid);
		this.version = validation.int(validation.or(version, 1), 1);
		this.name = validation.string(name);
		this.attributes = validation.array(attributes, validation.string);
		this.skills = validation.array(skills, validation.string);
		this.readonly = Boolean(readonly);
	}

	public toJSON(): ProfileData {
		return {
			uuid: this.uuid,
			version: this.version,
			name: this.name,
			attributes: this.attributes,
		};
	}
}