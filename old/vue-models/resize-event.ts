import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import MixinPlugin from "vue-models/mixin-plugin";

Vue.use(MixinPlugin);

const RESIZE_EVENT_LISTENER = Symbol('resize-event-listener');

export const RESIZE_EVENT = 'resize';

@Component
export default class ResizeEvent extends Vue {
	private [RESIZE_EVENT_LISTENER]: EventListener;

	protected created(): void {
		this[RESIZE_EVENT_LISTENER] = (event) => { this.$emit(RESIZE_EVENT, event); }
	}

	protected mounted(): void {
		window.addEventListener('resize', this[RESIZE_EVENT_LISTENER]);
	}

	protected beforeDestroy(): void {
		window.removeEventListener('resize', this[RESIZE_EVENT_LISTENER]);
	}
}