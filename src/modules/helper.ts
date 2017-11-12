import { WatchOptions } from 'vue';
import Vuex, * as VuexType from 'vuex';

export type RootType = { S: any, G: any, MD: any };
export function createStore<S, G = {}, M = {}, A extends ActionDefinition<A> = {}, MD extends ModuleDefinition<S, G, MD, MD> = {}>
	(options: StoreOptions<S, G, M, A, MD>): Store<S, G, M, A, MD> { return new Vuex.Store(options as any) as any; }
export function createModule<R extends RootType, S, G = {}, M = {}, A extends ActionDefinition<A> = {}, MD extends ModuleDefinition<R['S'], R['G'], R['MD'], MD> = {}>
	(definition: Module<S, G, M, A, MD, R['S'], R['G'], R['MD']>): TypedModule<S, G, M, A, MD, R['S'], R['G'], R['MD']> { return definition as any; }

export declare class Store<S, G, M, A extends ActionSignature, MD extends ModuleTree<S, G, MD>> extends VuexType.Store<S> {
	constructor(options: StoreOptions<S, G, M, A, MD>);

	readonly state: S & ModuleStateTree<MD>;
	readonly getters: G;

	dispatch: Dispatch<A>;
	commit: Commit<M>;

	subscribe<P extends VuexType.MutationPayload>(fn: (mutation: P, state: S) => any): () => void;
	watch<T>(getter: (state: S) => T, cb: (value: T, oldValue: T) => void, options?: WatchOptions): () => void;

	registerModule<T extends Module<any, any, any, any, any, S, G, MD>>(path: string, module: T, options?: VuexType.ModuleOptions): void;
	registerModule<T extends Module<any, any, any, any, any, S, G, MD>>(path: string[], module: T, options?: VuexType.ModuleOptions): void;

	unregisterModule(path: string): void;
	unregisterModule(path: string[]): void;

	hotUpdate(options: {
		getters?: GetterTree<S & ModuleStateTree<MD>, G, S & ModuleStateTree<MD>, G>;
		mutations?: MutationTree<S & ModuleStateTree<MD>, M>;
		actions?: ActionTree<S & ModuleStateTree<MD>, G, M, A, S & ModuleStateTree<MD>, G>;
		modules?: ModuleTree<S & ModuleStateTree<MD>, G, MD>;
	}): void;
	hotUpdate(options: {
		getters?: GetterTree<S, G, S, G>;
		mutations?: MutationTree<S, M>;
		actions?: ActionTree<S, G, M, A, S, G>;
		modules?: ModuleTree<S, G, any>;
	}): void;
}

export interface StoreOptions<S, G, M, A extends ActionSignature, MD extends ModuleTree<S, G, MD>> {
	readonly state?: S;
	readonly getters?: GetterTree<S & ModuleStateTree<MD>, G, S & ModuleStateTree<MD>, G>;
	readonly mutations?: MutationTree<S & ModuleStateTree<MD>, M>;
	readonly actions?: ActionTree<S & ModuleStateTree<MD>, G, M, A, S & ModuleStateTree<MD>, G>;
	readonly modules?: MD;
	readonly plugins?: Plugin<S, G, M, A, MD>[];
	readonly strict?: boolean;
}

export interface ActionContext<S, G, M, A extends ActionSignature, RS, RG> {
	readonly state: S;
	readonly getters: G;
	readonly rootState: RS;
	readonly rootGetters: RG;

	dispatch: Dispatch<A>;
	commit: Commit<M>;
}

export interface Dispatch<A extends ActionSignature> {
	<K extends keyof A>(type: K, payload?: A[K][0], options?: VuexType.DispatchOptions): Promise<A[K][1]>;
	(type: string, payload?: any, options?: VuexType.DispatchOptions): Promise<any>;
	<K extends keyof A>(payloadWithType: { type: K } & A[K][0], options?: VuexType.DispatchOptions): Promise<A[K][1]>;
	(payloadWithType: { type: string }, options?: VuexType.DispatchOptions): Promise<any>;
}

export interface Commit<M> {
	<K extends keyof M>(type: K, payload?: M[K], options?: VuexType.CommitOptions): void;
	(type: string, payload?: any, options?: VuexType.CommitOptions): void;
	<K extends keyof M>(payloadWithType: { type: K } & M[K], options?: VuexType.CommitOptions): void;
	(payloadWithType: { type: string }, options?: VuexType.CommitOptions): void;
}

export type Getter<S, G, RS, RG, P extends keyof G> = (state: S, getters: G, rootState: RS, rootGetters: RG) => G[P];
export type Mutation<S, M, P extends keyof M> = (state: S, payload: M[P]) => void;
export type ActionHandler<S, G, M, A extends ActionSignature, RS, RG, P extends keyof A> = (injectee: ActionContext<S, G, M, A, RS, RG>, payload: A[P][0]) => A[P][1];
export type ActionObject<S, G, M, A extends ActionSignature, RS, RG, P extends keyof A> = { root?: boolean, handler: ActionHandler<S, G, M, A, RS, RG, P> };
export type Action<S, G, M, A extends ActionSignature, RS, RG, P extends keyof A> = ActionHandler<S, G, M, A, RS, RG, P> | ActionObject<S, G, M, A, RS, RG, P>;
export type Plugin<S, G, M, A extends ActionSignature, MD extends ModuleTree<S, G, MD>> = (store: Store<S, G, M, A, MD>) => any;

export interface Module<S, G, M, A extends ActionSignature, MD extends ModuleTree<RS, RG, RMD>, RS, RG, RMD extends ModuleTree<RS, RG, RMD>> {
	readonly namespaced?: boolean;
	readonly state?: S | (() => S);
	readonly getters?: GetterTree<S & ModuleStateTree<MD>, G, RS & ModuleStateTree<RMD>, RG>;
	readonly mutations?: MutationTree<S & ModuleStateTree<MD>, M>;
	readonly actions?: ActionTree<S & ModuleStateTree<MD>, G, M, A, RS & ModuleStateTree<RMD>, RG>;
	readonly modules?: MD;
}

export interface TypedModule<S, G, M, A extends ActionSignature, MD extends ModuleTree<RS, RG, RMD>, RS, RG, RMD extends ModuleTree<RS, RG, RMD>> extends Module<S, G, M, A, MD, RS, RG, RMD> {
	readonly __state_type__: S;
}

export type ModuleStateTree<MD extends ModuleTree<any, any, any>> = {readonly [P in keyof MD]: MD[P]['__state_type__']};

export type GetterTree<S, G, RS, RG> = {
	readonly [P in keyof G]: Getter<S, G, RS, RG, P>;
};

export type MutationTree<S, M> = {
	readonly [P in keyof M]: Mutation<S, M, P>;
};

export type ActionTree<S, G, M, A extends ActionSignature, RS, RG,> = {
	readonly [P in keyof A]: Action<S, G, M, A, RS, RG, P>;
};

export interface ModuleTree<RS, RG, RMD extends ModuleTree<RS, RG, RMD>> {
	readonly [key: string]: TypedModule<any, any, any, any, any, RS, RG, RMD>;
}

export interface ActionSignature {
	readonly [key: string]: [any, any];
}

export type ActionDefinition<A> = {readonly [P in keyof A]: [any, any]} | {};

export type ModuleDefinition<RS, RG, RMD extends ModuleTree<RS, RG, RMD>, MD> = {readonly [P in keyof MD]: TypedModule<any, any, any, any, any, RS, RG, RMD>} | {};
