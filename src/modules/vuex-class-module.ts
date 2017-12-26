import * as Vuex from 'vuex';
import 'reflect-metadata';

export const TypeSymbol = Symbol('type');

export interface IModule<R = any> {
	readonly $state: any;
	readonly $getters: any;
	readonly $commit: Vuex.Commit;
	readonly $dispatch: Vuex.Dispatch;
	readonly $root: R;
}

interface DecoratedClass extends Function {
	namespaced?: boolean;
	__members__?: {
		getters?: { [key: string]: Function };
		mutations?: { [key: string]: Function };
		actions?: { [key: string]: Function };
		modules?: { [key: string]: DecoratedClass };
	}
}

interface Context {
	readonly state: any;
	readonly getters: any;
	readonly rootState: any;
	readonly rootGetters: any;
	readonly commit: Vuex.Commit;
	readonly dispatch: Vuex.Dispatch;
	readonly path: string;
	readonly writable: boolean;
}

class GetterContext implements Context {
	constructor(readonly state: any, readonly getters: any, readonly rootState: any, readonly rootGetters: any) { }
	public get commit(): never { throw new Error(getUnusableErrorMessage("getters", "commit")); }
	public get dispatch(): never { throw new Error(getUnusableErrorMessage("getters", "dispatch")); }
	public get path(): string { return ""; }
	public get writable(): false { return false; }
}

class MutationContext implements Context {
	constructor(readonly state: any) { }
	public get getters(): never { throw new Error(getUnusableErrorMessage("mutations", "getters")) }
	public get rootState(): never { throw new Error(getUnusableErrorMessage("mutations", "rootState")) }
	public get rootGetters(): never { throw new Error(getUnusableErrorMessage("mutations", "rootGetters")) }
	public get commit(): never { throw new Error(getUnusableErrorMessage("mutations", "commit")) }
	public get dispatch(): never { throw new Error(getUnusableErrorMessage("mutations", "displatch")) }
	public get path(): string { return ""; }
	public get writable(): true { return true; }
}

class ActionContext implements Context {
	constructor(readonly context: Vuex.ActionContext<any, any>) { }
	public get state(): any { return this.context.state; }
	public get getters(): any { return this.context.getters; }
	public get rootState(): any { return this.context.rootState; }
	public get rootGetters(): any { return this.context.rootGetters; }
	public get commit(): Vuex.Commit { return this.context.commit; }
	public get dispatch(): Vuex.Dispatch { return this.context.dispatch; }
	public get path(): string { return ""; }
	public get writable(): false { return false; }
}

class RootContext implements Context {
	constructor(readonly context: Context) { }
	public get state(): any { return this.context.rootState; }
	public get getters(): any { return this.context.rootGetters; }
	public get rootState(): any { return this.context.rootState; }
	public get rootGetters(): any { return this.context.rootGetters; }
	public get commit(): Vuex.Commit { return (type: string, payload: any) => this.context.commit(type, payload, { root: true }); }
	public get dispatch(): Vuex.Dispatch { return (type: string, payload: any) => this.context.dispatch(type, payload, { root: true }); }
	public get path(): string { return ""; }
	public get writable(): boolean { return this.context.writable; }
}

class ModuleContext implements Context {
	constructor(readonly parent: Context, readonly state: any, readonly path: string) { }
	public get getters(): any { return this.parent.getters; }
	public get rootState(): any { return this.parent.rootState; }
	public get rootGetters(): any { return this.parent.rootGetters; }
	public get commit(): Vuex.Commit { return this.parent.commit; }
	public get dispatch(): Vuex.Dispatch { return this.parent.dispatch; }
	public get writable(): boolean { return this.parent.writable; }
}

function getUnusableErrorMessage(context: string, property: string): string {
	return `Unable to use '${property}' in ${context}.`;
}

export function Module(options: Vuex.StoreOptions<any> | Vuex.Module<any, any>): <T>(target: T) => T;
export function Module<T>(target: T): T;
export function Module(): any {
	if (typeof arguments[0] === 'function') {
		return createModule(arguments[0]);
	} else {
		const options = arguments[0];
		return function (target: any) {
			return createModule(target, options);
		}
	}
}

export function Getter(target: any, key: string, descriptor: PropertyDescriptor): void {
	if (typeof descriptor.get !== 'function') throw new Error(`${key} is not a getter.`);

	setMember('getters', target, key, descriptor.get);
}

export function Mutation(target: any, key: string, descriptor: PropertyDescriptor): void {
	if (typeof descriptor.value !== 'function') throw new Error(`${key} is not a method.`);

	setMember('mutations', target, key, descriptor.value);
}

export function Action(target: any, key: string, descriptor: PropertyDescriptor): void {
	if (typeof descriptor.value !== 'function') throw new Error(`${key} is not a method.`);

	setMember('actions', target, key, descriptor.value);
}

export function Child(child: object): (target: any, key: string) => void;
export function Child(target: any, key: string): void;
export function Child(): any {
	if (arguments.length === 1) {
		const child = arguments[0];
		return function (target: any, key: string) {
			setModule(target, key, child);
		}
	} else {
		const target = arguments[0] as any;
		const key = arguments[1] as string;
		const child = Reflect.getMetadata('design:type', target, key);
		setModule(target, key, child);
	}

	function setModule(target: any, key: string, child: any) {
		if (typeof child !== 'function' && typeof child !== 'object') throw new Error(`${child} is not a module definition.`);

		setMember('modules', target, key, child);
	}
}

function setMember(type: 'getters' | 'mutations' | 'actions' | 'modules', target: any, key: string, value: any): void {
	if (typeof target.constructor !== 'function') throw new Error(`${target} has no constructor function.`);

	const Module = target.constructor as DecoratedClass;
	const members = Module.__members__ || (Module.__members__ = {});
	const entries = members[type] || (members[type] = Object.create(null));
	entries[key] = value;
}

function createModule(Module: Vuex.Module<any, any> & DecoratedClass, options?: any): any {
	Object.assign(Module, options);

	const master = Object.assign({ [TypeSymbol]: Module }, Reflect.construct(Module, []), Module.state);
	Module.state = () => Object.assign({}, master);

	if (Module.__members__) {
		const members = Module.__members__;

		if (members.getters) {
			const getters = Object.create(null);
			for (const key in members.getters) {
				const original = members.getters[key];
				getters[key] = function (state: any, getters: any, rootState: any, rootGetters: any): any {
					return original.call(getProxy(new GetterContext(state, getters, rootState, rootGetters)));
				}
			}

			Module.getters = Object.assign(getters, Module.getters);
		}

		if (members.mutations) {
			const mutations = Object.create(null);
			for (const key in members.mutations) {
				const original = members.mutations[key];
				mutations[key] = function (state: any, payload?: any[]): any {
					return original.apply(getProxy(new MutationContext(state)), payload);
				}
			}

			Module.mutations = Object.assign(mutations, Module.mutations);
		}

		if (members.actions) {
			const actions = Object.create(null);
			for (const key in members.actions) {
				const original = members.actions[key];
				actions[key] = function (context: any, payload?: any[]): any {
					return original.apply(getProxy(new ActionContext(context)), payload);
				}
			}

			Module.actions = Object.assign(actions, Module.actions);
		}

		if (members.modules) {
			Module.modules = Object.assign(Object.create(null), members.modules, Module.modules);
		}
	}

	return Module;
}

const handlers = new WeakMap<DecoratedClass, ProxyHandler<Context>>();
let altHandler: ProxyHandler<Context>;

type PropertyMap = { [key: string]: (context: Context, key: string) => any };
const basicProps: PropertyMap = {
	$state(context) { return context.state; },
	$getters(context) { return context.getters; },
	$commit(context) { return context.commit; },
	$dispatch(context) { return context.dispatch; },
	$root(context) { return getProxy(new RootContext(context)); },
};

function getProxy(context: Context): any {
	return new Proxy(context, getProxyHandler(context.state[TypeSymbol]));
}

function getProxyHandler(Module?: DecoratedClass): ProxyHandler<Context> {
	if (Module) {
		let handler = handlers.get(Module);
		if (!handler) handlers.set(Module, handler = createProxyHandler(Module));
		return handler;
	}
	return altHandler || (altHandler = createProxyHandler());
}

function createProxyHandler(Module?: DecoratedClass): ProxyHandler<Context> {
	return { get: createProxyGetHandler(Module), set: setHandler };
}

function createProxyGetHandler(Module?: DecoratedClass): ProxyHandler<Context>['get'] {
	const props = Object.assign(Object.create(null) as {}, basicProps);
	const members = Module && Module.__members__;
	if (members) {
		for (const key in members.getters || {}) props[key] = getGetter;
		for (const key in members.mutations || {}) props[key] = getMutation;
		for (const key in members.actions || {}) props[key] = getAction;
		for (const key in members.modules || {}) props[key] = getModule;
	}

	const prototype = (Module && Module.prototype) || Object.create(null);

	return function (target, prop) {
		return (
			prop in props ? props[prop](target, prop as string) :
				prop in prototype ? prototype[prop] : target.state[prop]
		);
	};
}

function getGetter(context: Context, key: string): any {
	return context.getters[context.path + key];
}

function getMutation(context: Context, key: string): any {
	return (...args: any[]) => context.commit.call(null, context.path + key, args);
}

function getAction(context: Context, key: string): any {
	return (...args: any[]) => context.dispatch.call(null, context.path + key, args);
}

function getModule(context: Context, key: string): any {
	const state = context.state[key];
	const type = state[TypeSymbol];
	const path = type && type.namespaced ? `${context.path}${key}/` : context.path;
	return getProxy(new ModuleContext(context, state, path));
}

function setHandler(target: Context, prop: PropertyKey, value: any): boolean {
	return target.writable ? Reflect.set(target.state, prop, value) : false;
}