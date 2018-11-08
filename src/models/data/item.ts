import { Hash } from "./hash";
import { validate } from "./validation";

export interface ItemData {
	readonly uuid: string;
	readonly name: string;
	readonly description?: string;
}

export interface ItemConfig {
	readonly uuid: string;
	readonly name: string;
	readonly description?: string;
}

export class Item implements ItemConfig {
	public readonly uuid: string;
	public readonly name: string;
	public readonly description: string;

	public get hash(): string { return Hash.get(this).hex; }

	public constructor({ uuid, name, description }: ItemConfig) {
		this.uuid = uuid;
		this.name = name;
		this.description = description !== undefined ? description : "";
	}

	public static from({ uuid, name, description }: ItemData): Item {
		return new Item({
			uuid: validate("uuid", uuid).string().uuid().value,
			name: validate("name", name).string().nonempty().value,
			description: validate("description", description).optional(v => v.string()).value,
		});
	}

	public toJSON(): ItemData {
		return {
			uuid: this.uuid,
			name: this.name,
			description: this.description,
		};
	}

	public set(config: Partial<ItemConfig>): Item {
		const { uuid, name, description } = this;

		return new Item({ uuid, name, description, ...config });
	}
}