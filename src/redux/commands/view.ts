import { CharacterView } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { setView, deleteView } from "redux/actions/view";

export default class ViewCommand {
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
			for (const view of views) {
				this.dispatch(setView(new CharacterView(view)));
			}
		});

		await this.setHook();
	}

	public async setHook(): Promise<void> {
		const self = this;
		DB.views.hook("creating", function (key, view) {
			this.onsuccess = function () {
				self.dispatch(setView(new CharacterView(view)));
			}
		});
		DB.views.hook("deleting", function (key) {
			this.onsuccess = function () {
				self.dispatch(deleteView(key));
			}
		});
	}
}