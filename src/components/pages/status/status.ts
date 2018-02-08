import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State, Getter, namespace } from 'vuex-class';
import { CharacterView, DataProvider, ExternalCache, EvaluationContext, Status } from "models/status";
import CacheStorage from "models/idb-cache";
import AppPage from "@component/frame/page";

const StatusGetter = namespace("status", Getter);
const ViewState = namespace("status/view", State);

@Component({
	components: {
		AppPage,
	}
})
export default class StatusPage extends Vue {
	@StatusGetter("provider")
	public readonly provider!: DataProvider;

	@ViewState("views")
	public readonly views!: { [uuid: string]: CharacterView };

	public get characters(): Status[] {
		return Object.entries(this.views)
			.filter(([uuid, view]) => view.visible)
			.map(([uuid]) => new EvaluationContext({ character: uuid }, this.provider))
			.filter(context => context.guard())
			.map(context => new Status(context as EvaluationContext))
			.map(status => new Status(status.$context, new ExternalCache(CacheStorage, status.$hash)))
			.sort((x, y) => String.prototype.localeCompare.call(x.name, y.name));
	}
}