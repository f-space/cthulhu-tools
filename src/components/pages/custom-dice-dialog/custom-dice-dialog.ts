import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import PageDialog from "@component/frame/dialog";

export interface CustomDiceDialogResult {
	readonly count: number;
	readonly max: number;
}

@Component({
	components: {
		PageDialog,
	}
})
export default class CustomDiceDialog extends PageDialog<CustomDiceDialogResult> {
	@Prop({ default: 1 })
	public readonly initCount!: number;

	@Prop({ default: 100 })
	public readonly initMax!: number;

	public count: number = this.initCount;
	public max: number = this.initMax;
	public valid: boolean = true;

	@Watch("count")
	protected onCountChanged(): void { this.valid = this.validate(); }

	@Watch("max")
	protected onMaxChanged(): void { this.valid = this.validate(); }

	public ok(): void { this.commit({ count: this.count, max: this.max }); }

	private validate(): boolean {
		const { count, max } = this.$refs as { [prop: string]: HTMLInputElement };
		return [count, max].every(x => x.validity.valid);
	}
}