import Vue from 'vue';
import { Item, ItemProvider } from "models/status";
import DB from "models/storage";
import { Module, Getter, Mutation, Action } from "modules/vuex-class-module";

type ItemTable = { [uuid: string]: Item };

@Module({ namespaced: true })
export default class ItemModule implements ItemProvider {
	public items: ItemTable = Object.create(null);

	@Getter
	public get provider(): ItemProvider { return this; }

	@Mutation
	public set_item(item: Item): void {
		Vue.set(this.items, item.uuid, item);
	}

	@Mutation
	public delete_item(uuid: string): void {
		Vue.delete(this.items, uuid);
	}

	@Action
	public async create(item: Item): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.add(item.toJSON());
		}).then(() => {
			this.set_item(item);
		});
	}

	@Action
	public async update(item: Item): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.update(item.uuid, item.toJSON());
		}).then(() => {
			this.set_item(item);
		});
	}

	@Action
	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.items, () => {
			return DB.items.delete(uuid);
		}).then(() => {
			this.delete_item(uuid);
		});
	}

	@Action
	public async load(): Promise<void> {
		await DB.transaction("r", DB.items, () => {
			return DB.items.toArray();
		}).then(items => {
			for (const item of items) {
				this.set_item(new Item(item));
			}
		});
	}

	public get(uuid: string): Item | undefined;
	public get(uuids: string[]): Item[];
	public get(uuids: string | string[]): Item | Item[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.items[uuid]).filter(x => x !== undefined)
			: this.items[uuids];
	}

	public list() { return Object.values(this.items); }
}