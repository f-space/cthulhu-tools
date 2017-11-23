import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import PageDialog from "@component/dialog";

@Component({
	components: {
		PageDialog,
	}
})
export default class CustomDiceDialog extends Vue {
	@Prop({ default: 1 })
	public initCount: number;

	@Prop({ default: 100 })
	public initMax: number;

	public count: number = this.initCount;
	public max: number = this.initMax;
	public valid: boolean = true;

	@Watch("count")
	protected onCountChanged(): void { this.valid = this.validate(); }

	@Watch("max")
	protected onMaxChanged(): void { this.valid = this.validate(); }

	public ok(): void { this.$emit('closed', { canceled: false, count: this.count, max: this.max }); }
	public cancel(): void { this.$emit('closed', { canceled: true }); }

	private validate(): boolean {
		const { count, max } = this.$refs as { [prop: string]: HTMLInputElement };
		return [count, max].every(x => x.validity.valid);
	}
}