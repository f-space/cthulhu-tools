import { Attribute } from "models/attribute";
import { Skill } from "models/skill";
import { Property, AttributeProperty, SkillProperty } from "models/property";

export interface PropertyResolver {
	list(): Property[];
	resolve(id: string): Property | undefined;
}

export class AttributeResolver implements PropertyResolver {
	public readonly attributes: { readonly [id: string]: Attribute };

	public constructor(attributes: ReadonlyArray<Attribute>) {
		this.attributes = attributes.reduce((map, attr) => (map[attr.id] = attr, map), Object.create(null));
	}

	public list(): AttributeProperty[] {
		return Object.values(this.attributes).map(attribute => new AttributeProperty(attribute));
	}

	public resolve(id: string): AttributeProperty | undefined {
		return (id in this.attributes) ? new AttributeProperty(this.attributes[id]) : undefined;
	}
}

export class SkillResolver implements PropertyResolver {
	public readonly skills: { readonly [id: string]: Skill };

	public constructor(skills: ReadonlyArray<Skill>) {
		this.skills = skills.reduce((map, skill) => (map[skill.id] = skill, map), Object.create(null));
	}

	public list(): SkillProperty[] {
		return Object.values(this.skills).map(skill => new SkillProperty(skill));
	}

	public resolve(id: string): SkillProperty | undefined {
		return (id in this.skills) ? new SkillProperty(this.skills[id]) : undefined;
	}
}

export class CompoundResolver implements PropertyResolver {
	public constructor(readonly resolvers: ReadonlyArray<PropertyResolver>) { }

	public list(): Property[] {
		const map = Object.create(null);
		for (const resolver of this.resolvers) {
			for (const property of resolver.list()) {
				if (!(property.id in map)) map[property.id] = property;
			}
		}

		return Array.from(Object.values(map));
	}

	public resolve(id: string): Property | undefined {
		for (const resolver of this.resolvers) {
			const result = resolver.resolve(id);

			if (result !== undefined) return result;
		}

		return undefined;
	}
}

export class VoidResolver implements PropertyResolver {
	private constructor() { }
	public static readonly instance: VoidResolver = new VoidResolver();
	public list(): Property[] { return []; }
	public resolve(id: string): Property | undefined { return undefined; }
}