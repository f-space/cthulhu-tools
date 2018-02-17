import Vue, { CreateElement, RenderContext, VNode } from 'vue';
import { Component, Provide, Inject } from 'vue-property-decorator';
import MixinPlugin from "vue-models/mixin-plugin";

Vue.use(MixinPlugin);

interface DialogData {
	readonly component: typeof Vue;
	readonly data: any;
	readonly callback: Function;
}

type VueClass<T extends Vue> = { new(...args: any[]): T } & typeof Vue;

const DIALOG_OPEN_EVENT = 'dialog:open';
const DIALOG_CLOSE_EVENT = 'dialog:close';

@Component
class DialogHub extends Vue {
	private dialog: DialogData | null = null;

	public get current(): DialogData | null { return this.dialog; }

	public created(): void {
		this.$on(DIALOG_OPEN_EVENT, this.open);
		this.$on(DIALOG_CLOSE_EVENT, this.close);
	}

	public open(dialog: DialogData): void {
		if (this.dialog) this.close({ status: false });
		this.dialog = dialog;
	}

	public close(result: DialogResult<any>): void {
		const callback = this.dialog && this.dialog.callback;
		this.dialog = null;
		if (callback) callback(result);
	}

	public commit(value: any): void {
		if (this.dialog) this.close({ status: true, value });
	}

	public cancel(): void {
		if (this.dialog) this.close({ status: false });
	}
}

const DialogRenderer = Vue.extend({
	functional: true,
	inject: ['$dialog'],
	render(createElement: CreateElement, context: RenderContext): VNode {
		const hub = context.injections.$dialog;
		const dialog = hub.current || {} as DialogData;
		return createElement(dialog.component, {
			props: dialog.data,
			on: { [DIALOG_CLOSE_EVENT]() { return hub.$emit(DIALOG_CLOSE_EVENT, ...arguments); } },
		});
	},
})

@Component({
	components: { DialogSlot: DialogRenderer },
})
export class DialogHost extends Vue {
	@Provide()
	public readonly $dialog!: DialogHub;

	protected beforeCreate(this: any): void {
		this.$dialog = new DialogHub();
	}
}

@Component
export class DialogClient extends Vue {
	@Inject()
	public readonly $dialog!: DialogHub;

	public openDialog<T>(dialog: VueClass<Dialog<T>>, data?: any): Promise<DialogResult<T>> {
		return new Promise(resolve => {
			this.$dialog.$emit(DIALOG_OPEN_EVENT, {
				component: dialog,
				data: data,
				callback: resolve,
			} as DialogData);
		});
	}
}

@Component
export class Dialog<T> extends Vue {
	public commit(value?: T): void {
		this.$emit(DIALOG_CLOSE_EVENT, { status: true, value: value });
	}
	public cancel(): void {
		this.$emit(DIALOG_CLOSE_EVENT, { status: false });
	}
}

export interface DialogCommittedResult<T> {
	readonly status: true;
	readonly value: T;
}

export interface DialogCanceledResult {
	readonly status: false;
}

export type DialogResult<T> = DialogCommittedResult<T> | DialogCanceledResult;