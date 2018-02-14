import { CharacterView } from "models/status";
import DB from "models/storage";
import { Store } from "redux/reducers/root";
import { setView, deleteView } from "redux/actions/view";

export default class ViewCommand {
	public constructor(readonly store: Store) { }

	public async update(view: CharacterView): Promise<void> {
		await DB.transaction("rw", DB.views, () => {
			return DB.views.update(view.target, view.toJSON());
		}).then(() => {
			this.store.dispatch(setView(view));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.views, () => {
			return DB.views.toArray();
		}).then(views => {
			for (const view of views) {
				this.store.dispatch(setView(new CharacterView(view)));
			}
		});

		await this.setHook();
	}

	public async setHook(): Promise<void> {
		const self = this;
		DB.views.hook("creating", function (key, view) {
			this.onsuccess = function () {
				self.store.dispatch(setView(new CharacterView(view)));
			}
		});
		DB.views.hook("deleting", function (key) {
			this.onsuccess = function () {
				self.store.dispatch(deleteView(key));
			}
		});
	}
}