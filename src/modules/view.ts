import Vue from 'vue';
import { CharacterView } from "models/status";
import DB from "models/storage";
import { Module, Getter, Mutation, Action } from "modules/vuex-class-module";

type ViewTable = { [uuid: string]: CharacterView };

@Module({ namespaced: true })
export default class ViewModule {
	public views: ViewTable = Object.create(null);

	@Mutation
	public set_view(view: CharacterView): void {
		Vue.set(this.views, view.target, view);
	}

	@Mutation
	public delete_view(target: string): void {
		Vue.delete(this.views, target);
	}

	@Action
	public async update(view: CharacterView): Promise<void> {
		await DB.transaction("rw", DB.views, () => {
			return DB.views.update(view.target, view.toJSON());
		}).then(() => {
			this.set_view(view);
		});
	}

	@Action
	public async load(): Promise<void> {
		await DB.transaction("r", DB.views, () => {
			return DB.views.toArray();
		}).then(views => {
			for (const view of views) {
				this.set_view(new CharacterView(view));
			}
		});

		await this.setHook();
	}

	@Action
	public async setHook(): Promise<void> {
		const self = this;
		DB.views.hook("creating", function (key, view) {
			this.onsuccess = function () {
				self.set_view(new CharacterView(view));
			}
		});
		DB.views.hook("deleting", function (key) {
			this.onsuccess = function () {
				self.delete_view(key);
			}
		});
	}
}