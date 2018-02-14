import { History } from "models/status";
import DB from "models/storage";
import { Store } from "redux/reducers/root";
import { setHistory, deleteHistory } from "redux/actions/history";

export default class HistoryCommand {
	public constructor(readonly store: Store) { }

	public async create(history: History): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.add(history.toJSON());
		}).then(() => {
			this.store.dispatch(setHistory(history));
		});
	}

	public async update(history: History): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.update(history.uuid, history.toJSON());
		}).then(() => {
			this.store.dispatch(setHistory(history));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.delete(uuid);
		}).then(() => {
			this.store.dispatch(deleteHistory(uuid));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.histories, () => {
			return DB.histories.toArray();
		}).then(histories => {
			for (const history of histories) {
				this.store.dispatch(setHistory(new History(history)));
			}
		});
	}
}