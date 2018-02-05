import * as validation from "models/validation";

export interface ProfileData {
	readonly uuid?: string;
	readonly version?: number;
	readonly name: string;
	readonly attributes?: ReadonlyArray<string>;
}

export class Profile implements ProfileData {
	public readonly uuid: string;
	public readonly version: number;
	public readonly name: string;
	public readonly attributes: ReadonlyArray<string>;
	public readonly readonly: boolean;

	public constructor({ uuid, version, name, attributes }: ProfileData, readonly?: boolean) {
		this.uuid = validation.uuid(uuid);
		this.version = validation.int(validation.or(version, 1), 1);
		this.name = validation.string(name);
		this.attributes = validation.array(attributes, validation.string);
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