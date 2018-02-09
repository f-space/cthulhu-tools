import { Vue, VueConstructor } from 'vue/types/vue';
import { ComponentOptions } from 'vue/types/options';
import mixin from "vue-models/mixin";

type VueCtor<V extends Vue> = { new(...args: any[]): V };
type VueClass<V extends Vue> = VueCtor<V> & typeof Vue;
type MixinType<V extends Vue> = ComponentOptions<V> | VueClass<V>;

declare module 'vue/types/vue' {
	interface VueConstructor {
		mixes<
			M1 extends Vue>(
				mixin1: MixinType<M1>): this & VueCtor<M1>;
		mixes<
			M1 extends Vue,
			M2 extends Vue>(
				mixin1: MixinType<M1>,
				mixin2: MixinType<M2>): this & VueCtor<M1 & M2>;
		mixes<
			M1 extends Vue,
			M2 extends Vue,
			M3 extends Vue>(
				mixin1: MixinType<M1>,
				mixin2: MixinType<M2>,
				mixin3: MixinType<M3>): this & VueCtor<M1 & M2 & M3>;
		mixes<
			M1 extends Vue,
			M2 extends Vue,
			M3 extends Vue,
			M4 extends Vue>(
				mixin1: MixinType<M1>,
				mixin2: MixinType<M2>,
				mixin3: MixinType<M3>,
				mixin4: MixinType<M4>): this & VueCtor<M1 & M2 & M3 & M4>;
		mixes<
			M1 extends Vue,
			M2 extends Vue,
			M3 extends Vue,
			M4 extends Vue,
			M5 extends Vue>(
				mixin1: MixinType<M1>,
				mixin2: MixinType<M2>,
				mixin3: MixinType<M3>,
				mixin4: MixinType<M4>,
				mixin5: MixinType<M5>): this & VueCtor<M1 & M2 & M3 & M4 & M5>;
		mixes<
			M1 extends Vue,
			M2 extends Vue,
			M3 extends Vue,
			M4 extends Vue,
			M5 extends Vue,
			M6 extends Vue>(
				mixin1: MixinType<M1>,
				mixin2: MixinType<M2>,
				mixin3: MixinType<M3>,
				mixin4: MixinType<M4>,
				mixin5: MixinType<M5>,
				mixin6: MixinType<M6>): this & VueCtor<M1 & M2 & M3 & M4 & M5 & M6>;
		mixes<
			M1 extends Vue,
			M2 extends Vue,
			M3 extends Vue,
			M4 extends Vue,
			M5 extends Vue,
			M6 extends Vue,
			M7 extends Vue>(
				mixin1: MixinType<M1>,
				mixin2: MixinType<M2>,
				mixin3: MixinType<M3>,
				mixin4: MixinType<M4>,
				mixin5: MixinType<M5>,
				mixin6: MixinType<M6>,
				mixin7: MixinType<M7>): this & VueCtor<M1 & M2 & M3 & M4 & M5 & M6 & M7>;
		mixes<
			M1 extends Vue,
			M2 extends Vue,
			M3 extends Vue,
			M4 extends Vue,
			M5 extends Vue,
			M6 extends Vue,
			M7 extends Vue,
			M8 extends Vue>(
				mixin1: MixinType<M1>,
				mixin2: MixinType<M2>,
				mixin3: MixinType<M3>,
				mixin4: MixinType<M4>,
				mixin5: MixinType<M5>,
				mixin6: MixinType<M6>,
				mixin7: MixinType<M7>,
				mixin8: MixinType<M8>): this & VueCtor<M1 & M2 & M3 & M4 & M5 & M6 & M7 & M8>;
	}
}

export default {
	install(Vue: VueConstructor): void {
		Vue.mixes = function () { return (mixin as any)(this, ...arguments); }
	}
};