import Vue from 'vue';
import { DiceImageLayout, DiceSprite } from 'components/resource/resource';

export default Vue.extend({
	name: "dice-image",
	inject: ["app"],
	props: {
		type: {
			type: String,
			required: true,
		},
		face: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			canvas: null as HTMLCanvasElement | null,
			dirty: true,
		};
	},
	computed: {
		image(this: any): HTMLImageElement | null { return this.app.resources.diceImage; },
		layout(this: any): DiceImageLayout | null { return this.app.resources.diceImageLayout; },
		ready(): boolean { return Boolean(this.canvas && this.image && this.layout); },
		sprite(): DiceSprite | null {
			const layout = this.layout;
			const sprites = (layout && layout[this.type]) || null;
			const sprite = (sprites && sprites[this.face - 1]) || null;
			return sprite;
		},
	},
	watch: {
		type() { this.dirty = true; },
		face() { this.dirty = true; },
		ready(value) { if (value) this.dirty = true; },
		dirty: {
			handler(value) { if (value) this.$nextTick(function () { this.refresh(); }); },
			immediate: true,
		},
	},
	methods: {
		refresh() {
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
		},
	},
	mounted() {
		this.canvas = this.$el as HTMLCanvasElement;
	},
});