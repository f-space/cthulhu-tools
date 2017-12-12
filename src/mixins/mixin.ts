import { Vue } from 'vue/types/vue';
import { ComponentOptions } from 'vue/types/options';

type VueCtor<V extends Vue> = { new(...args: any[]): V };
type VueClass<V extends Vue> = VueCtor<V> & typeof Vue;
type MixinType<V extends Vue> = ComponentOptions<V> | VueClass<V>;

function mixin<
	T extends VueClass<Vue>,
	M1 extends Vue>(
	Base: T,
	mixin1: MixinType<M1>): T & VueCtor<M1>;
function mixin<
	T extends VueClass<Vue>,
	M1 extends Vue,
	M2 extends Vue>(
	Base: T,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>): T & VueCtor<M1 & M2>;
function mixin<
	T extends VueClass<Vue>,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue>(
	Base: T,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>): T & VueCtor<M1 & M2 & M3>;
function mixin<
	T extends VueClass<Vue>,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue>(
	Base: T,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>): T & VueCtor<M1 & M2 & M3 & M4>;
function mixin<
	T extends VueClass<Vue>,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue,
	M5 extends Vue>(
	Base: T,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>,
	mixin5: MixinType<M5>): T & VueCtor<M1 & M2 & M3 & M4 & M5>;
function mixin<
	T extends VueClass<Vue>,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue,
	M5 extends Vue,
	M6 extends Vue>(
	Base: T,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>,
	mixin5: MixinType<M5>,
	mixin6: MixinType<M6>): T & VueCtor<M1 & M2 & M3 & M4 & M5 & M6>;
function mixin<
	T extends VueClass<Vue>,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue,
	M5 extends Vue,
	M6 extends Vue,
	M7 extends Vue>(
	Base: T,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>,
	mixin5: MixinType<M5>,
	mixin6: MixinType<M6>,
	mixin7: MixinType<M7>): T & VueCtor<M1 & M2 & M3 & M4 & M5 & M6 & M7>;
function mixin<
	T extends VueClass<Vue>,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue,
	M5 extends Vue,
	M6 extends Vue,
	M7 extends Vue,
	M8 extends Vue>(
	Base: T,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>,
	mixin5: MixinType<M5>,
	mixin6: MixinType<M6>,
	mixin7: MixinType<M7>,
	mixin8: MixinType<M8>): T & VueCtor<M1 & M2 & M3 & M4 & M5 & M6 & M7 & M8>;
function mixin(Base: VueClass<Vue>, ...mixins: MixinType<Vue>[]) {
	return Base.extend({ mixins });
}

export default mixin;