import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import MixinPlugin from "vue-models/mixin-plugin";
import ResizeEvent from "vue-models/resize-event";

Vue.use(MixinPlugin);

@Component
export default class ReactiveSize extends Vue.mixes(ResizeEvent) {
	public readonly width: number = 0;
	public readonly height: number = 0;

	protected mounted(): void {
		updateSize.call(this);
		this.$on('resize', () => { updateSize.call(this); });
	}
}

function updateSize(this: ReactiveSize): void {
	this.$nextTick(function (this: any) {
		const view = this.$el as Element;
		this.width = view.clientWidth;
		this.height = view.clientHeight;
	});
}