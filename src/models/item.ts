import * as validation from "models/validation";

export interface ItemData {
	readonly uuid?: string;
	readonly name: string;
	readonly description?: string;
}

export class Item {
	public readonly uuid: string;
	public readonly name: string;
	public readonly description: string;

	public constructor({ uuid, name, description }: ItemData) {
		this.uuid = validation.uuid(uuid);
		this.name = validation.string(name);
		this.description = validation.string(validation.or(description, ""));
	}

	public toJSON(): ItemData {
		return {
			uuid: this.uuid,
			name: this.name,
			description: this.description,
		};
	}
}