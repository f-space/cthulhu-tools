import { CharacterViewData, CharacterView } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { ViewAction } from "redux/actions/view";

export default class ViewDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async update(view: CharacterView): Promise<void> {
		await DB.transaction("rw", DB.views, () => {
			return DB.views.update(view.target, view.toJSON());
		}).then(() => {
			this.dispatch(ViewAction.set(view));
		});
	}

	public async load(): Promise<void> {
		await DB.transaction("r", DB.views, () => {
			return DB.views.toArray();
		}).then(views => {
			this.dispatch(ViewAction.set(this.validate(views)));
			this.setHook();
		});
	}

	public setHook(): void {
		DB.views.hook("creating", (key, view, transaction) => {
			transaction.on('complete', () => {
				this.dispatch(ViewAction.set(CharacterView.from(view)));
			});
		});
		DB.views.hook("deleting", (key, view, transaction) => {
			transaction.on('complete', () => {
				this.dispatch(ViewAction.delete(key));
			});
		});
	}

	private validate(views: ReadonlyArray<CharacterViewData>): CharacterView[] {
		const result = [] as CharacterView[];
		for (const view of views) {
			try {
				result.push(CharacterView.from(view));
			} catch (e) {
				if (e instanceof Error) {
					console.error(`Failed to load a view: ${e.message}`);
				} else throw e;
			}
		}
		return result;
	}
}