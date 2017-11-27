import * as Vuex from 'vuex';
import 'reflect-metadata';

export abstract class ModuleInterface {
	public static state: any;
	public static getters?: Vuex.GetterTree<any, any>;
	public static mutations?: Vuex.MutationTree<any>;
	public static actions?: Vuex.ActionTree<any, any>;
	public static modules?: Vuex.ModuleTree<any>;
}

type DecoratedClass = {
	namespaced?: boolean;
	__root__?: { key: string, module: () => DecoratedClass };
	__getters__?: { [key: string]: Function };
	__mutations__?: { [key: string]: Function };
	__actions__?: { [key: string]: Function };
	__modules__?: { [key: string]: DecoratedClass };
}

interface GetterContext {
	state: any;
	getters: any;
}

interface GetterContextWithRoot extends GetterContext {
	rootState: any;
	rootGetters: any;
}

interface ActionContext {
	state: any;
	getters: any;
	commit: Vuex.Commit;
	dispatch: Vuex.Dispatch;
}

interface ActionContextWithRoot extends ActionContext {
	rootState: any;
	rootGetters: any;
}

export function Store(target: any): any;
export function Store(options: Vuex.StoreOptions<any>): (target: any) => any;
export function Store(argument: any) {
	if (typeof argument === 'function') {
		return createModule(argument, true);
	} else {
		return function (target: any) {
			return createModule(target, true, argument);
		}
	}
}

export function Module(target: any): any;
export function Module(options: Vuex.Module<any, any> & { __root__: DecoratedClass["__root__"] }): (target: any) => any;
export function Module(argument: any) {
	if (typeof argument === 'function') {
		return createModule(argument, false);
	} else {
		return function (target: any) {
			return createModule(target, false, argument);
		}
	}
}

export function Getter(target: ModuleInterface, key: string, descriptor: PropertyDescriptor): void {
	if (typeof descriptor.get === 'function' && typeof target.constructor === 'function') {
		const Module = target.constructor as DecoratedClass;
		(Module.__getters__ || (Module.__getters__ = Object.create(null)))[key] = descriptor.get;
	}
}

export function Mutation(target: ModuleInterface, key: string, descriptor: PropertyDescriptor): void {
	if (typeof descriptor.value === 'function' && typeof target.constructor === 'function') {
		const Module = target.constructor as DecoratedClass;
		(Module.__mutations__ || (Module.__mutations__ = Object.create(null)))[key] = descriptor.value;
	}
}

export function Action(target: ModuleInterface, key: string, descriptor: PropertyDescriptor): void {
	if (typeof descriptor.value === 'function' && typeof target.constructor === 'function') {
		const Module = target.constructor as DecoratedClass;
		(Module.__actions__ || (Module.__actions__ = Object.create(null)))[key] = descriptor.value;
	}
}

export function SubModule(Module: typeof ModuleInterface): (target: ModuleInterface, key: string) => void;
export function SubModule(target: ModuleInterface, key: string): void;
export function SubModule(...args: any[]) {
	if (args.length !== 1) {
		const target = args[0] as ModuleInterface;
		const key = args[1] as string;
		const type = Reflect.getMetadata('design:type', target, key);
		addModule(target, key, type)
		return;
	} else {
		const Module = args[0] as ModuleInterface;
		return function (target: ModuleInterface, key: string) {
			addModule(target, key, Module);
		}
	}

	function addModule(target: ModuleInterface, key: string, module: ModuleInterface) {
		if (typeof module === 'function' && typeof target.constructor === 'function') {
			const Module = target.constructor as DecoratedClass;
			(Module.__modules__ || (Module.__modules__ = Object.create(null)))[key] = module;
		}
	}
}

function createModule(Module: typeof ModuleInterface & DecoratedClass, isStore: boolean, options: any = {}) {
	Object.assign(Module, options);

	const originalState = Module.state;
	const newState = () => Object.assign(Reflect.construct(Module, []), originalState);
	Module.state = isStore ? newState() : newState;

	if (Module.__getters__) {
		const getters = Object.create(null);
		for (const key in Module.__getters__) {
			const original = Module.__getters__[key];
			getters[key] = function (state: any, getters: any, rootState: any, rootGetters: any): any {
				const proxy = getGetterProxy(Module, { state, getters, rootState, rootGetters });
				return original.call(proxy);
			}
		}

		Module.getters = Object.assign(getters, Module.getters);
	}

	if (Module.__mutations__) {
		const mutations = Object.create(null);
		for (const key in Module.__mutations__) {
			const original = Module.__mutations__[key];
			mutations[key] = function (state: any, payload?: any[]): any {
				return original.apply(state, payload);
			}
		}

		Module.mutations = Object.assign(mutations, Module.mutations);
	}

	if (Module.__actions__) {
		const actions = Object.create(null);
		for (const key in Module.__actions__) {
			const original = Module.__actions__[key];
			actions[key] = function (context: any, payload?: any[]): any {
				const proxy = getActionProxy(Module, context);
				return original.apply(proxy, payload);
			}
		}

		Module.actions = Object.assign(actions, Module.actions);
	}

	if (Module.__modules__) {
		Module.modules = Object.assign(Object.create(null), Module.__modules__, Module.modules);
	}

	return Module;
}

const getterProxyCache = new WeakMap();
const actionProxyCache = new WeakMap();

function getGetterProxy(Module: DecoratedClass, context: GetterContextWithRoot): any {
	let proxy = getterProxyCache.get(context.state);
	if (!proxy) getterProxyCache.set(context.state, proxy = createGetterProxy(Module, context));
	return proxy;
}

function createGetterProxy(Module: DecoratedClass, context: GetterContextWithRoot): any;
function createGetterProxy(Module: DecoratedClass, context: GetterContext, root?: (() => any) | null, path?: string): any;
function createGetterProxy(Module: DecoratedClass, context: GetterContext, root?: (() => any) | null, path: string = ""): any {
	if (root === undefined) root = createRootProxy(Module, context as GetterContextWithRoot);

	const { __root__, __getters__, __modules__ } = Module;
	const { state, getters } = context;

	const cache = Object.create(null);
	return new Proxy(state, {
		get: (target, prop, receiver) => {
			if (typeof prop === 'string') {
				if (__root__ && prop === __root__.key) return getCache(prop, () => root ? root() : receiver);
				if (__getters__ && prop in __getters__) return getters[path + prop];
				if (__modules__ && prop in __modules__) return getCache(prop, () => createSubProxy(prop, __modules__[prop]));
			}
			return target[prop];
		}
	});

	function createRootProxy(Module: DecoratedClass, context: GetterContextWithRoot): any {
		if (Module.__root__) {
			const { rootState: state, rootGetters: getters } = context;
			const rootContext = { state, getters };

			return createGetterProxy(Module.__root__.module(), rootContext, null);
		}
		return undefined;
	}

	function createSubProxy(name: string, SubModule: DecoratedClass): any {
		const newPath = SubModule.namespaced ? `${path}${name}/` : path;
		return createGetterProxy(SubModule, context, root, newPath);
	}

	function getCache<T>(key: string, factory: () => T): T {
		return (cache[key] || (cache[key] = factory()));
	}
}

function getActionProxy(Module: DecoratedClass, context: ActionContextWithRoot): any {
	let proxy = actionProxyCache.get(context.state);
	if (!proxy) actionProxyCache.set(context.state, proxy = createActionProxy(Module, context));
	return proxy;
}

function createActionProxy(Module: DecoratedClass, context: ActionContextWithRoot): any;
function createActionProxy(Module: DecoratedClass, context: ActionContext, root?: (() => any) | null, path?: string): any;
function createActionProxy(Module: DecoratedClass, context: ActionContext, root?: (() => any) | null, path: string = ""): any {
	if (root === undefined) root = () => createRootProxy(Module, context as ActionContextWithRoot);

	const { __root__, __getters__, __mutations__, __actions__, __modules__ } = Module;
	const { state, getters, commit, dispatch } = context;

	const cache = Object.create(null);
	return new Proxy(state, {
		get: (target, prop, receiver) => {
			if (typeof prop === 'string') {
				if (__root__ && prop === __root__.key) return getCache(prop, () => root ? root() : receiver);
				if (__getters__ && prop in __getters__) return getters[path + prop];
				if (__mutations__ && prop in __mutations__) return (...args: any[]) => commit.call(null, path + prop, args);
				if (__actions__ && prop in __actions__) return (...args: any[]) => dispatch.call(null, path + prop, args);
				if (__modules__ && prop in __modules__) return getCache(prop, () => createSubProxy(prop, __modules__[prop]));
			}
			return target[prop];
		}
	});

	function createRootProxy(Module: DecoratedClass, context: ActionContextWithRoot): any {
		if (Module.__root__) {
			const { rootState: state, rootGetters: getters, commit, dispatch } = context;
			const rootContext = {
				state,
				getters,
				commit(type: string, payload: any) { return commit(type, payload, { root: true }); },
				dispatch(type: string, payload: any) { return dispatch(type, payload, { root: true }); },
			}

			return createActionProxy(Module.__root__.module(), rootContext, null);
		}
		return undefined;
	}

	function createSubProxy(name: string, SubModule: DecoratedClass): any {
		const newPath = SubModule.namespaced ? `${path}${name}/` : path;
		return createActionProxy(SubModule, context, root, newPath);
	}

	function getCache<T>(key: string, factory: () => T): T {
		return (cache[key] || (cache[key] = factory()));
	}
}