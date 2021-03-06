import { Hash, Reference, Attribute, Skill } from "models/data";
import {
	Property, AttributeProperty, SkillProperty,
	AttributeValueProperty, AttributeMinProperty, AttributeMaxProperty,
	SkillValueProperty, SkillBaseProperty, SkillPointsProperty,
} from "./property";

export interface ResolutionContext {
	readonly ref: Reference;
}

export interface PropertyResolver {
	readonly hash: string;
	resolve(context: ResolutionContext): Property | undefined;
}

export interface TerminalResolver extends PropertyResolver {
	supports(context: ResolutionContext): boolean;
}

export class AttributeResolver implements TerminalResolver {
	public readonly attributes: ReadonlyMap<string, Attribute>;

	public get hash(): string {
		return Hash.get(this, self => AttributeResolver.name + Array.from(self.attributes.values()).map(attr => attr.hash).join('')).hex;
	}

	public constructor(attributes: ReadonlyArray<Attribute>) {
		this.attributes = attributes.reduce((map, attr) => map.set(attr.id, attr), new Map<string, Attribute>());
	}

	public supports(context: ResolutionContext): boolean {
		return (context.ref.scope === 'attr');
	}

	public resolve(context: ResolutionContext): AttributeProperty | undefined {
		const { ref } = context;
		const attribute = this.attributes.get(ref.id);
		if (attribute) {
			switch (ref.modifier) {
				case '': return new AttributeValueProperty(attribute);
				case 'min': return new AttributeMinProperty(attribute);
				case 'max': return new AttributeMaxProperty(attribute);
			}
		}
		return undefined;
	}
}

export class SkillResolver implements TerminalResolver {
	public readonly skills: ReadonlyMap<string, Skill>;

	public get hash(): string {
		return Hash.get(this, self => SkillResolver.name + Array.from(self.skills.values()).map(skill => skill.hash).join('')).hex;
	}

	public constructor(skills: ReadonlyArray<Skill>) {
		this.skills = skills.reduce((map, skill) => map.set(skill.id, skill), new Map<string, Skill>());
	}

	public supports(context: ResolutionContext): boolean {
		return (context.ref.scope === 'skill');
	}

	public resolve(context: ResolutionContext): SkillProperty | undefined {
		const { ref } = context;
		const skill = this.skills.get(ref.id);
		if (skill) {
			switch (ref.modifier) {
				case '': return new SkillValueProperty(skill);
				case 'base': return new SkillBaseProperty(skill);
				case 'points': return new SkillPointsProperty(skill);
			}
		}
		return undefined;
	}
}

export class CompositeResolver implements PropertyResolver {
	public get hash(): string {
		return Hash.get(this, self => CompositeResolver.name + self.resolvers.map(resolver => resolver.hash).join('')).hex;
	}

	public constructor(readonly resolvers: ReadonlyArray<TerminalResolver>) { }

	public resolve(context: ResolutionContext): Property | undefined {
		const resolver = this.resolvers.find(resolver => resolver.supports(context));

		return resolver && resolver.resolve(context);
	}
}

export class VoidResolver implements PropertyResolver {
	public get hash(): string { return Hash.get(this, () => VoidResolver.name).hex; }
	public resolve(): undefined { return undefined; }
}

export interface ResolverConfig {
	readonly attributes?: ReadonlyArray<Attribute>;
	readonly skills?: ReadonlyArray<Skill>;
}

export function buildResolver(config: ResolverConfig): PropertyResolver {
	const resolvers = [] as TerminalResolver[];

	if (config.attributes) resolvers.push(new AttributeResolver(config.attributes));
	if (config.skills) resolvers.push(new SkillResolver(config.skills));

	switch (resolvers.length) {
		case 0: return new VoidResolver();
		case 1: return resolvers[0];
		default: return new CompositeResolver(resolvers);
	}
}