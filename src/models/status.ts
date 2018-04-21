import { Reference } from "models/expression";
import { Character, CharacterParams } from "models/character";
import { Profile } from "models/profile";
import { Attribute } from "models/attribute";
import { Skill } from "models/skill";
import { History } from "models/history";
import { DataProvider } from "models/provider";
import { Cache } from "models/cache";
import { PropertyResolver, AttributeResolver, SkillResolver, CompoundResolver, VoidResolver } from "models/resolver";
import { PropertyEvaluator, AttributeEvaluator, SkillEvaluator, CompoundEvaluator, HistoryEvaluator, CacheEvaluator, VoidEvaluator } from "models/evaluator";
import { getSHA256 } from "models/utility";

export * from "models/expression";
export * from "models/character";
export * from "models/profile";
export * from "models/attribute";
export * from "models/skill";
export * from "models/item";
export * from "models/history";
export * from "models/property";
export * from "models/provider";
export * from "models/cache";
export * from "models/resolver";
export * from "models/evaluator";

type ContextKey = 'character' | 'profile' | 'attributes' | 'skills' | 'history';

interface ResolutionMap {
	character: 'character' | 'profile' | 'attributes' | 'skills' | 'history';
	profile: 'profile' | 'attributes';
	attributes: 'attributes';
	skills: 'skills';
	history: 'history';
}

export interface UnresolvedDataContext {
	readonly character: Character | string;
	readonly profile: Profile | string;
	readonly attributes: ReadonlyArray<Attribute | string>;
	readonly skills: ReadonlyArray<Skill | string>;
	readonly history: History | string | null;
}

export interface DataContext extends UnresolvedDataContext {
	readonly character: Character;
	readonly profile: Profile;
	readonly attributes: ReadonlyArray<Attribute>;
	readonly skills: ReadonlyArray<Skill>;
	readonly history: History | null;
}

type UnresolvedPartialContext<K extends ContextKey> = Pick<Partial<UnresolvedDataContext>, K>;
type PartialContext<K extends ContextKey> = Pick<Partial<DataContext>, K>;
type ResolvedPartialContext<K extends ContextKey> = PartialContext<ResolutionMap[K]> & DataContextPrototype;

export interface DataContextPrototype {
	guard(): this is DataContext;
}

export interface DataContextConstructor {
	new <K extends ContextKey>(source: UnresolvedPartialContext<K>, provider: DataProvider): ResolvedPartialContext<K | 'skills'>;
	readonly prototype: DataContextPrototype;
}

export interface CharacterDataContext extends ResolvedPartialContext<'character'> { }
export interface ProfileDataContext extends ResolvedPartialContext<'profile'> { }
export interface AttributeDataContext extends ResolvedPartialContext<'attributes'> { }
export interface SkillDataContext extends ResolvedPartialContext<'skills'> { }
export interface HistoryDataContext extends ResolvedPartialContext<'history'> { }

export interface ResolverBuilderOptions extends PartialContext<'attributes' | 'skills'> { }

export interface EvaluatorBuilderOptions extends PartialContext<'character' | 'attributes' | 'skills' | 'history'> {
	readonly params?: Partial<CharacterParams>;
	readonly cache?: Cache;
}

export const DataContext: DataContextConstructor = (function () {
	function DataContext(this: any, source: UnresolvedDataContext, provider: DataProvider): Partial<DataContextPrototype> {
		const character = opt(source.character, character => resolve(character, provider.character));
		const profile = opt(or(source.profile, opt(character, x => x.profile)), profile => resolve(profile, provider.profile));
		const attributes = map(or(source.attributes, opt(profile, x => x.attributes)), x => resolve(x, provider.attribute));
		const skills = map(or(source.skills, opt(profile, x => x.skills)), x => resolve(x, provider.skill));
		const history = opt(or(source.history, opt(character, x => x.history)), history => resolve(history, provider.history));

		return Object.assign(this, { character, profile, attributes, skills, history });

		function resolve<T>(value: T | string, provider: { get(key: string): T | undefined }): T | undefined {
			return (typeof value === 'string' ? provider.get(value) : value);
		}

		function or<T, U>(value: T | undefined, alt: U): T | U {
			return (value !== undefined ? value : alt);
		}

		function opt<T, U>(value: T | undefined, fn: (value: T) => U): U | undefined {
			return (value !== undefined ? fn(value) : undefined);
		}

		function map<T, U>(value: ReadonlyArray<T> | undefined, fn: (valut: T) => U | undefined): U[] | undefined {
			return (value !== undefined ? value.map(fn).filter(x => x !== undefined) as U[] : undefined);
		}
	}

	DataContext.prototype.guard = function (this: DataContext): boolean {
		return (this.character !== undefined
			&& this.profile !== undefined
			&& this.attributes !== undefined
			&& this.skills !== undefined
			&& this.history !== undefined);
	}

	return DataContext as any;
})();

export class ResolverBuilder {
	public attributes?: ReadonlyArray<Attribute>;
	public skills?: ReadonlyArray<Skill>;

	public constructor(options?: ResolverBuilderOptions) {
		if (options) {
			this.attributes = options.attributes;
			this.skills = options.skills;
		}
	}

	public static build(options?: ResolverBuilderOptions): PropertyResolver {
		return new ResolverBuilder(options).build();
	}

	public build(): PropertyResolver {
		return this.createCompoundResolver([
			this.createAttributeResolver(),
			this.createSkillResolver(),
		].filter(x => x !== null) as PropertyResolver[]);
	}

	private createCompoundResolver(resolvers: PropertyResolver[]): PropertyResolver {
		switch (resolvers.length) {
			case 0: return VoidResolver.instance;
			case 1: return resolvers[0];
			default: return new CompoundResolver(resolvers);
		}
	}

	private createAttributeResolver(): AttributeResolver | null {
		return (this.attributes ? new AttributeResolver(this.attributes) : null);
	}

	private createSkillResolver(): SkillResolver | null {
		return (this.skills ? new SkillResolver(this.skills) : null);
	}
}

export class EvaluatorBuilder {
	public attributes?: ReadonlyArray<Attribute>;
	public skills?: ReadonlyArray<Skill>;
	public history?: History | null;
	public params?: Partial<CharacterParams>;
	public cache?: Cache;

	public constructor(options?: EvaluatorBuilderOptions) {
		if (options) {
			this.attributes = options.attributes;
			this.skills = options.skills;
			this.history = options.history;
			this.params = options.params || (options.character && options.character.params);
			this.cache = options.cache;
		}
	}

	public static build(options?: EvaluatorBuilderOptions): PropertyEvaluator {
		return new EvaluatorBuilder(options).build();
	}

	public build(): PropertyEvaluator {
		return this.createCacheEvaluator(
			this.createHistoryEvaluator(
				this.createCompoundEvaluator([
					this.createAttributeEvaluator(),
					this.createSkillEvaluator(),
				].filter(x => x !== null) as PropertyEvaluator[])
			)
		);
	}

	private createCacheEvaluator(base: PropertyEvaluator): PropertyEvaluator {
		return new CacheEvaluator(base, this.cache);
	}

	private createHistoryEvaluator(base: PropertyEvaluator): PropertyEvaluator {
		return (this.history ? new HistoryEvaluator(base, this.history) : base);
	}

	private createCompoundEvaluator(evaluators: PropertyEvaluator[]): PropertyEvaluator {
		switch (evaluators.length) {
			case 0: return VoidEvaluator.instance;
			case 1: return evaluators[0];
			default: return new CompoundEvaluator(evaluators);
		}
	}

	private createAttributeEvaluator(): AttributeEvaluator | null {
		if (this.attributes) {
			const data = (this.params && this.params.attribute) || Object.create(null);
			return new AttributeEvaluator(data);
		}
		return null;
	}

	private createSkillEvaluator(): SkillEvaluator | null {
		if (this.skills) {
			const data = (this.params && this.params.skill) || Object.create(null);
			return new SkillEvaluator(data);
		}
		return null;
	}
}

export class Status {
	readonly [id: string]: any;

	private readonly context: DataContext;
	private readonly resolver: PropertyResolver;
	private readonly evaluator: PropertyEvaluator;

	public constructor(context: DataContext, cache?: Cache) {
		this.context = Object.assign({}, context, { cache });
		this.resolver = ResolverBuilder.build(this.context);
		this.evaluator = EvaluatorBuilder.build(this.context);

		return new Proxy(this, {
			get(target, key) {
				if (typeof key === 'string' && !key.startsWith("$")) {
					const { context, resolver, evaluator } = target;
					const property = resolver.resolve(new Reference(key, null));
					const hash = context.history && context.history.head;
					return property && evaluator.evaluate({ property, hash, resolver, evaluator });
				}
				return target[key];
			}
		});
	}

	public get $context(): DataContext { return this.context; }
	public get $uuid(): string { return this.context.character.uuid; }
	public get $character(): Character { return this.context.character; }
	public get $profile(): Profile { return this.context.profile; }
	public get $attributes(): ReadonlyArray<Attribute> { return this.context.attributes; }
	public get $skills(): ReadonlyArray<Skill> { return this.context.skills; }
	public get $history(): History | null { return this.context.history; }
	public get $resolver(): PropertyResolver { return this.resolver; }
	public get $evaluator(): PropertyEvaluator { return this.evaluator; }
	public get $hash(): string { return Status.basicsHash(this); }

	public static basics(status: Status): any {
		const { context: { attributes, skills }, resolver, evaluator } = status;
		return [...attributes.filter(x => !x.view), ...skills]
			.map(({ id }) => resolver.resolve(new Reference(id))!)
			.filter(property => property)
			.reduce((values, property) => {
				values[property.ref.id] = evaluator.evaluate({
					property,
					hash: null,
					resolver,
					evaluator,
				});
				return values;
			}, Object.create(null));
	}

	public static basicsHash(status: Status): any {
		const values = this.basics(status);
		const json = JSON.stringify(values, Object.keys(values).sort());
		return getSHA256(json);
	}
}