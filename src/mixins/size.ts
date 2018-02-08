import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ResizeEventMixin, { mixin } from "mixins/resize-event";

export { mixin };

@Component
export default class SizeMixin extends mixin(Vue, ResizeEventMixin) {
	public readonly width: number = 0;
	public readonly height: number = 0;

	protected mounted(): void { updateSize.call(this); }
	protected resized(): void { updateSize.call(this); }
}

function updateSize(this: SizeMixin): void {
	this.$nextTick(function (this: any) {
		const view = this.$el as Element;
		this.width = view.clientWidth;
		this.height = view.clientHeight;
	});
}