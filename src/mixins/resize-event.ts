import Vue from 'vue';
import { Vue as VueType } from 'vue/types/vue';

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

const strategies = Vue.config.optionMergeStrategies;
strategies.resized = strategies.created;

const RESIZED_EVENT_HANDLER = Symbol('resized');

export default Vue.extend({
	created() {
		const handlers: Function[] | undefined = this.$options.resized as any;
		if (handlers) {
			Reflect.set(this, RESIZED_EVENT_HANDLER, (...args: any[]) => {
				for (const handler of handlers) {
					handler.call(this, args);
				}
			});
		}
	},
	mounted() {
		if (Reflect.has(this, RESIZED_EVENT_HANDLER)) {
			const handler = Reflect.get(this, RESIZED_EVENT_HANDLER);
			window.addEventListener('resize', handler);
		}
	},
	beforeDestroy() {
		if (Reflect.has(this, RESIZED_EVENT_HANDLER)) {
			const handler = Reflect.get(this, RESIZED_EVENT_HANDLER);
			window.removeEventListener('resize', handler);
		}
	},
});