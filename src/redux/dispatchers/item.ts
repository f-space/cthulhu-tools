import { Item } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { setItem, deleteItem } from "redux/actions/item";

export default class ItemDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(item: Item): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.add(item.toJSON());
		}).then(() => {
			this.dispatch(setItem(item));
		});
	}

	public async update(item: Item): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.update(item.uuid, item.toJSON());
		}).then(() => {
			this.dispatch(setItem(item));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.delete(uuid);
		}).then(() => {
			this.dispatch(deleteItem(uuid));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.items, () => {
			return DB.items.toArray();
		}).then(items => {
			for (const item of items) {
				this.dispatch(setItem(new Item(item)));
			}
		});
	}
}