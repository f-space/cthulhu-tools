import { Item } from "models/status";
import DB from "models/storage";
import { Store } from "redux/reducers/root";
import { setItem, deleteItem } from "redux/actions/item";

export default class ItemCommand {
	public constructor(readonly store: Store) { }

	public async create(item: Item): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.add(item.toJSON());
		}).then(() => {
			this.store.dispatch(setItem(item));
		});
	}

	public async update(item: Item): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.update(item.uuid, item.toJSON());
		}).then(() => {
			this.store.dispatch(setItem(item));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.delete(uuid);
		}).then(() => {
			this.store.dispatch(deleteItem(uuid));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.items, () => {
			return DB.items.toArray();
		}).then(items => {
			for (const item of items) {
				this.store.dispatch(setItem(new Item(item)));
			}
		});
	}
}