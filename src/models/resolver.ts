import { Attribute } from "models/attribute";
import { Skill } from "models/skill";
import {
	Property, AttributeProperty, SkillProperty,
	AttributeValueProperty, AttributeMinProperty, AttributeMaxProperty,
	SkillValueProperty, SkillBaseProperty, SkillPointsProperty,
} from "models/property";
import { ResolutionContext, PropertyResolver } from "models/evaluation";

export class AttributeResolver implements PropertyResolver {
	public readonly attributes: ReadonlyMap<string, Attribute>;

	public constructor(attributes: ReadonlyArray<Attribute>) {
		this.attributes = attributes.reduce((map, attr) => map.set(attr.id, attr), new Map<string, Attribute>());
	}

	public resolve(context: ResolutionContext): AttributeProperty | undefined {
		const { ref } = context;
		const attribute = this.attributes.get(ref.id);
		if (attribute) {
			switch (ref.modifier) {
				case null: return new AttributeValueProperty(attribute);
				case 'min': return new AttributeMinProperty(attribute);
				case 'max': return new AttributeMaxProperty(attribute);
			}
		}
		return undefined;
	}
}

export class SkillResolver implements PropertyResolver {
	public readonly skills: ReadonlyMap<string, Skill>;

	public constructor(skills: ReadonlyArray<Skill>) {
		this.skills = skills.reduce((map, skill) => map.set(skill.id, skill), new Map<string, Skill>());
	}

	public resolve(context: ResolutionContext): SkillProperty | undefined {
		const { ref } = context;
		const skill = this.skills.get(ref.id);
		if (skill) {
			switch (ref.modifier) {
				case null: return new SkillValueProperty(skill);
				case 'base': return new SkillBaseProperty(skill);
				case 'points': return new SkillPointsProperty(skill);
			}
		}
		return undefined;
	}
}

export class CompositeResolver implements PropertyResolver {
	public constructor(readonly resolvers: ReadonlyArray<PropertyResolver>) { }

	public resolve(context: ResolutionContext): Property | undefined {
		for (const resolver of this.resolvers) {
			const result = resolver.resolve(context);

			if (result !== undefined) return result;
		}

		return undefined;
	}
}

export class VoidResolver implements PropertyResolver {
	public resolve(): undefined { return undefined; }
}

export interface ResolverConfig {
	readonly attributes?: ReadonlyArray<Attribute>;
	readonly skills?: ReadonlyArray<Skill>;
}

export function buildResolver(config: ResolverConfig): PropertyResolver {
	const resolvers = [] as PropertyResolver[];

	if (config.attributes) resolvers.push(new AttributeResolver(config.attributes));
	if (config.skills) resolvers.push(new SkillResolver(config.skills));

	switch (resolvers.length) {
		case 0: return new VoidResolver();
		case 1: return resolvers[0];
		default: return new CompositeResolver(resolvers);
	}
}