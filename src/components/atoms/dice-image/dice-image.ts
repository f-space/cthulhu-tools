import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { DiceImage as DiceImageRenderer } from "models/resource";

@Component
export default class DiceImage extends Vue {
	@Prop({ required: true })
	public type: string;

	@Prop({ required: true })
	public face: number;

	@Prop({ required: true })
	public image: DiceImageRenderer | null;

	public get state(): string { return this.image ? `${this.type}-${this.face}` : ""; }

	@Watch("state")
	protected onStateChanged(): void { this.refresh(); }

	protected mounted(): void { this.refresh(); }

	public refresh(): void {
		const canvas = this.$el as HTMLCanvasElement | null;
		if (canvas && this.image) {
			this.image.draw(canvas, this.type, this.face - 1);
		}
	}
}
