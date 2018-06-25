import { ItemData, Item } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { ItemAction } from "redux/actions/item";

export default class ItemDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(item: Item): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.add(item.toJSON());
		}).then(() => {
			this.dispatch(ItemAction.set(item));
		});
	}

	public async update(item: Item): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.update(item.uuid, item.toJSON());
		}).then(() => {
			this.dispatch(ItemAction.set(item));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.delete(uuid);
		}).then(() => {
			this.dispatch(ItemAction.delete(uuid));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.items, () => {
			return DB.items.toArray();
		}).then(items => {
			this.dispatch(ItemAction.set(this.validate(items)));
		});
	}

	private validate(items: ReadonlyArray<ItemData>): Item[] {
		const result = [] as Item[];
		for (const item of items) {
			try {
				result.push(Item.from(item));
			} catch (e) {
				if (e instanceof Error) {
					console.error(`Failed to load an item: ${e.message}`);
				} else throw e;
			}
		}
		return result;
	}
}