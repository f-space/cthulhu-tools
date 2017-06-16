export interface ItemData {
	readonly name: string;
	readonly description?: string;
}

export class Item implements ItemData {
	public readonly name: string;
	public readonly description: string;

	public constructor(data: ItemData);
	public constructor(name: string, description?: string);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as ItemData;

			this.name = String(data.name);
			this.description = (data.description !== undefined ? String(data.description) : "");
		} else {
			const name = args[0] as string;
			const description = args[1] as string | undefined;

			this.name = name;
			this.description = (description !== undefined ? description : "");
		}
	}

	public toJSON(): ItemData {
		return {
			name: this.name,
			description: this.description || undefined,
		};
	}
}