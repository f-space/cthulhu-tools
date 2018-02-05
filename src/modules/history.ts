import Vue from 'vue';
import { History, HistoryProvider } from "models/status";
import DB from "models/storage";
import { Module, Getter, Mutation, Action } from "modules/vuex-class-module";

type HistoryTable = { [uuid: string]: History };

@Module({ namespaced: true })
export default class HistoryModule implements HistoryProvider {
	public histories: HistoryTable = Object.create(null);

	@Getter
	public get provider(): HistoryProvider { return this; }

	@Mutation
	public set_history(history: History): void {
		Vue.set(this.histories, history.uuid, history);
	}

	@Mutation
	public delete_history(uuid: string): void {
		Vue.delete(this.histories, uuid);
	}

	@Action
	public async create(history: History): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.add(history.toJSON());
		}).then(() => {
			this.set_history(history);
		});
	}

	@Action
	public async update(history: History): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.update(history.uuid, history.toJSON());
		}).then(() => {
			this.set_history(history);
		});
	}

	@Action
	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.delete(uuid);
		}).then(() => {
			this.delete_history(uuid);
		});
	}

	@Action
	public async load(): Promise<void> {
		await DB.transaction("r", DB.histories, () => {
			return DB.histories.toArray();
		}).then(histories => {
			for (const history of histories) {
				this.set_history(new History(history));
			}
		});
	}

	public get(uuid: string): History | undefined;
	public get(uuids: string[]): History[];
	public get(uuids: string | string[]): History | History[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.histories[uuid]).filter(x => x !== undefined)
			: this.histories[uuids];
	}

	public list() { return Object.values(this.histories); }
}