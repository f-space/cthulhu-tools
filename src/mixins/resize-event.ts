import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Vue as VueType } from 'vue/types/vue';

export { default as mixin } from './mixin';

declare module 'vue/types/options' {
	interface ComponentOptions<
		V extends VueType,
		Data=DefaultData<V>,
		Methods=DefaultMethods<V>,
		Computed=DefaultComputed,
		PropsDef=PropsDefinition<DefaultProps>> {
		resized?(): void;
	}
}

Component.registerHooks(["resized"]);

const strategies = Vue.config.optionMergeStrategies;
strategies.resized = strategies.created;

const RESIZED_EVENT_HANDLER = Symbol('resized');

@Component
export default class ResizeEventMixin extends Vue {
	protected created(): void {
		const handlers: Function[] | undefined = this.$options.resized as any;
		if (handlers) {
			Reflect.set(this, RESIZED_EVENT_HANDLER, (...args: any[]) => {
				for (const handler of handlers) {
					handler.call(this, args);
				}
			});
		}
	}

	protected mounted(): void {
		if (Reflect.has(this, RESIZED_EVENT_HANDLER)) {
			const handler = Reflect.get(this, RESIZED_EVENT_HANDLER);
			window.addEventListener('resize', handler);
		}
	}

	protected beforeDestroy(): void {
		if (Reflect.has(this, RESIZED_EVENT_HANDLER)) {
			const handler = Reflect.get(this, RESIZED_EVENT_HANDLER);
			window.removeEventListener('resize', handler);
		}
	}
}