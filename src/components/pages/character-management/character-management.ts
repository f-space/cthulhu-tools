import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { State, Getter, Action, namespace } from 'vuex-class';
import { CharacterView, Character, DataProvider, ExternalCache, EvaluationContext, Status } from "models/status";
import CacheStorage from "models/idb-cache";
import SelectableItem from "@component/molecules/selectable-item";
import AppPage from "@component/frame/page";

const StatusGetter = namespace("status", Getter);
const ViewState = namespace("status/view", State);
const ViewAction = namespace("status/view", Action);
const CharacterAction = namespace("status/character", Action);

const CHARACTER_EDIT_PAGE = "/status/character-edit";

@Component({
	components: {
		SelectableItem,
		AppPage,
	}
})
export default class CharacterManagementPage extends Vue {
	public checked: { [uuid: string]: boolean } = Object.create(null);

	@StatusGetter("provider")
	public readonly provider!: DataProvider;

	@ViewState("views")
	public readonly views!: { [uuid: string]: CharacterView };

	@ViewAction("update")
	public readonly updateView!: (args: [CharacterView]) => void;

	@CharacterAction("create")
	public readonly createCharacter!: (args: [Character]) => void;

	@CharacterAction("delete")
	public readonly deleteCharacter!: (args: [string]) => void;

	public get some(): boolean { return Object.values(this.checked).some(x => x); }

	public get single(): boolean { return Object.values(this.checked).reduce((sum, x) => sum + (x ? 1 : 0), 0) === 1; }

	public get selection(): string[] { return Object.keys(this.checked).filter(uuid => this.checked[uuid]); }

	public get characters(): Status[] {
		return Object.keys(this.views)
			.map(uuid => new EvaluationContext({ character: uuid }, this.provider))
			.filter(context => context.guard())
			.map(context => new Status(context as EvaluationContext))
			.map(status => new Status(status.$context, new ExternalCache(CacheStorage, status.$hash)))
			.sort((x, y) => String.prototype.localeCompare.call(x.name, y.name));
	}

	public toggleVisibility(uuid: string): void {
		const oldView = this.views[uuid];
		const newView = new CharacterView(Object.assign(oldView, { visible: !oldView.visible }))
		this.updateView([newView]);
	}

	public deleteOp(): void {
		this.selection.forEach(uuid => this.deleteCharacter([uuid]));

		this.checked = Object.create(null);
	}

	public cloneOp(): void {
		const sources = this.provider.character.get(this.selection);
		for (const source of sources) {
			const character = new Character(Object.assign(source.toJSON(), { uuid: undefined }));
			this.createCharacter([character]);
		}

		this.checked = Object.create(null);
	}

	public editOp(): void {
		const target = this.selection[0];
		if (target !== undefined) {
			this.$router.push({ path: CHARACTER_EDIT_PAGE, query: { uuid: target } });
		}
	}

	public importOp(): void {
		// TODO: implementation
	}

	public exportOp(): void {
		// TODO: implementation
	}

}