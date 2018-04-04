import { CharacterView } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { setView, deleteView } from "redux/actions/view";

export default class ViewDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async update(view: CharacterView): Promise<void> {
		await DB.transaction("rw", DB.views, () => {
			return DB.views.update(view.target, view.toJSON());
		}).then(() => {
			this.dispatch(setView(view));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.views, () => {
			return DB.views.toArray();
		}).then(views => {
			this.dispatch(setView(views.map(view => new CharacterView(view))));
		});

		await this.setHook();
	}

	public async setHook(): Promise<void> {
		DB.views.hook("creating", (key, view, transaction) => {
			transaction.on('complete', () => {
				this.dispatch(setView(new CharacterView(view)));
			});
		});
		DB.views.hook("deleting", (key, view, transaction) => {
			transaction.on('complete', () => {
				this.dispatch(deleteView(key));
			});
		});
	}
}