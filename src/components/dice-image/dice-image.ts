import Vue from 'vue';
import { Component, Inject, Prop, Watch } from 'vue-property-decorator';
import App from "@component/app";
import { DiceImageLayout, DiceSprite } from "@component/resource";

@Component
export default class DiceImage extends Vue {
	@Inject()
	private app: App;

	@Prop({ required: true })
	public type: string;

	@Prop({ required: true })
	public face: number;

	private canvas: HTMLCanvasElement | null = null;

	private dirty: boolean = true;

	public get image(): HTMLImageElement | null { return this.app.resources.diceImage; }
	public get layout(): DiceImageLayout | null { return this.app.resources.diceImageLayout; }
	public get ready(): boolean { return Boolean(this.canvas && this.image && this.layout); }
	public get sprite(): DiceSprite | null {
		const layout = this.layout;
		const sprites = (layout && layout[this.type]) || null;
		const sprite = (sprites && sprites[this.face - 1]) || null;
		return sprite;
	}

	@Watch("type")
	private onTypeChanged(): void { this.dirty = true; }

	@Watch("face")
	private onFaceChanged(): void { this.dirty = true; }

	@Watch("ready")
	private onReadyChanged(value: boolean): void { if (value) this.dirty = true; }

	@Watch("dirty", { immediate: true })
	private onDirtyChanged(value: boolean): void { if (value) this.$nextTick(function () { this.refresh(); }); }

	protected mounted(): void {
		this.canvas = this.$el as HTMLCanvasElement;
	}

	public refresh(): void {
		const canvas = this.canvas;
		const image = this.image;
		const sprite = this.sprite;

		if (canvas && image && image.complete) {
			if (sprite) {
				const { x, y, w, h } = sprite;
				canvas.width = w;
				canvas.height = h;

				const context = canvas.getContext('2d');
				if (context) {
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(image, x, y, w, h, 0, 0, canvas.width, canvas.height);
				}
			} else {
				canvas.width = 0;
				canvas.height = 0;
			}
		}

		this.dirty = false;
	}
}
