import { HistoryData, History } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { HistoryAction } from "redux/actions/history";

export default class HistoryDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(history: History): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.add(history.toJSON());
		}).then(() => {
			this.dispatch(HistoryAction.set(history));
		});
	}

	public async update(history: History): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.update(history.uuid, history.toJSON());
		}).then(() => {
			this.dispatch(HistoryAction.set(history));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.histories, () => {
			return DB.histories.delete(uuid);
		}).then(() => {
			this.dispatch(HistoryAction.delete(uuid));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.histories, () => {
			return DB.histories.toArray();
		}).then(histories => {
			this.dispatch(HistoryAction.set(this.validate(histories)));
		});
	}

	private validate(histories: ReadonlyArray<HistoryData>, readonly?: boolean): History[] {
		const result = [] as History[];
		for (const history of histories) {
			try {
				result.push(History.from(history, readonly));
			} catch (e) {
				if (e instanceof Error) {
					console.error(`Failed to load a history: ${e.message}`);
				} else throw e;
			}
		}
		return result;
	}
}