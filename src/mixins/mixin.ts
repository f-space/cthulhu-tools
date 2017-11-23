import Vue from 'vue';
import { ComponentOptions } from 'vue/types/options';

type VueClass<V extends Vue> = { new(...args: any[]): V } & typeof Vue;
type MixinType<V extends Vue> = ComponentOptions<V> | VueClass<V>;

function mixin<
	T extends Vue,
	M1 extends Vue>(
	Base: VueClass<T>,
	mixin1: MixinType<M1>): VueClass<T & M1>;
function mixin<
	T extends Vue,
	M1 extends Vue,
	M2 extends Vue>(
	Base: VueClass<T>,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>): VueClass<T & M1 & M2>;
function mixin<
	T extends Vue,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue>(
	Base: VueClass<T>,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>): VueClass<T & M1 & M2 & M3>;
function mixin<
	T extends Vue,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue>(
	Base: VueClass<T>,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>): VueClass<T & M1 & M2 & M3 & M4>;
function mixin<
	T extends Vue,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue,
	M5 extends Vue>(
	Base: VueClass<T>,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>,
	mixin5: MixinType<M5>): VueClass<T & M1 & M2 & M3 & M4 & M5>;
function mixin<
	T extends Vue,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue,
	M5 extends Vue,
	M6 extends Vue>(
	Base: VueClass<T>,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>,
	mixin5: MixinType<M5>,
	mixin6: MixinType<M6>): VueClass<T & M1 & M2 & M3 & M4 & M5 & M6>;
function mixin<
	T extends Vue,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue,
	M5 extends Vue,
	M6 extends Vue,
	M7 extends Vue>(
	Base: VueClass<T>,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>,
	mixin5: MixinType<M5>,
	mixin6: MixinType<M6>,
	mixin7: MixinType<M7>): VueClass<T & M1 & M2 & M3 & M4 & M5 & M6 & M7>;
function mixin<
	T extends Vue,
	M1 extends Vue,
	M2 extends Vue,
	M3 extends Vue,
	M4 extends Vue,
	M5 extends Vue,
	M6 extends Vue,
	M7 extends Vue,
	M8 extends Vue>(
	Base: VueClass<T>,
	mixin1: MixinType<M1>,
	mixin2: MixinType<M2>,
	mixin3: MixinType<M3>,
	mixin4: MixinType<M4>,
	mixin5: MixinType<M5>,
	mixin6: MixinType<M6>,
	mixin7: MixinType<M7>,
	mixin8: MixinType<M8>): VueClass<T & M1 & M2 & M3 & M4 & M5 & M6 & M7 & M8>;
function mixin(Base: VueClass<Vue>, ...mixins: MixinType<Vue>[]) {
	return Base.extend({ mixins });
}

export default mixin;