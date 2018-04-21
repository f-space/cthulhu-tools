import { Reference } from "models/expression";
import { Attribute } from "models/attribute";
import { Skill } from "models/skill";
import { Property, AttributeProperty, SkillProperty } from "models/property";

export interface PropertyResolver {
	resolve(ref: Reference): Property | undefined;
}

export class AttributeResolver implements PropertyResolver {
	public readonly attributes: ReadonlyMap<string, Attribute>;

	public constructor(attributes: ReadonlyArray<Attribute>) {
		this.attributes = attributes.reduce((map, attr) => map.set(attr.id, attr), new Map<string, Attribute>());
	}

	public resolve(ref: Reference): AttributeProperty | undefined {
		const attribute = this.attributes.get(ref.id);
		if (attribute) {
			switch (ref.modifier) {
				case null: return AttributeProperty.value(attribute);
				case 'min': return AttributeProperty.min(attribute);
				case 'max': return AttributeProperty.max(attribute);
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

	public resolve(ref: Reference): SkillProperty | undefined {
		const skill = this.skills.get(ref.id);
		if (skill) {
			switch (ref.modifier) {
				case null: return SkillProperty.value(skill);
				case 'base': return SkillProperty.base(skill);
				case 'points': return SkillProperty.points(skill);
			}
		}
		return undefined;
	}
}

export class CompoundResolver implements PropertyResolver {
	public constructor(readonly resolvers: ReadonlyArray<PropertyResolver>) { }

	public resolve(ref: Reference): Property | undefined {
		for (const resolver of this.resolvers) {
			const result = resolver.resolve(ref);

			if (result !== undefined) return result;
		}

		return undefined;
	}
}

export class VoidResolver implements PropertyResolver {
	private constructor() { }
	public static readonly instance: VoidResolver = new VoidResolver();
	public resolve(ref: Reference): undefined { return undefined; }
}