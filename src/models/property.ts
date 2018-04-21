import { Reference } from "models/expression";
import { Attribute } from "models/attribute";
import { Skill } from "models/skill";

export type PropertyType = 'attribute' | 'skill';

interface IProperty<T extends PropertyType> {
	readonly type: T;
	readonly ref: Reference;
	readonly view: boolean;
}

export class AttributeProperty implements IProperty<'attribute'> {
	public get type(): 'attribute' { return 'attribute'; }
	public get key(): string { return this.ref.key; }
	public get modifier(): string | null { return this.ref.modifier; }

	public constructor(readonly attribute: Attribute, readonly ref: Reference, readonly view: boolean) { }

	public static value(attribute: Attribute): AttributeProperty {
		return new AttributeProperty(attribute, new Reference(attribute.id), attribute.view);
	}

	public static min(attribute: Attribute): AttributeProperty {
		return new AttributeProperty(attribute, new Reference(attribute.id, 'min'), true);
	}

	public static max(attribute: Attribute): AttributeProperty {
		return new AttributeProperty(attribute, new Reference(attribute.id, 'max'), true);
	}
}

export class SkillProperty implements IProperty<'skill'> {
	public get type(): 'skill' { return 'skill'; }
	public get key(): string { return this.ref.key; }
	public get modifier(): string | null { return this.ref.modifier; }

	public constructor(readonly skill: Skill, readonly ref: Reference, readonly view: boolean) { }

	public static value(skill: Skill): SkillProperty {
		return new SkillProperty(skill, new Reference(skill.id), true);
	}

	public static base(skill: Skill): SkillProperty {
		return new SkillProperty(skill, new Reference(skill.id, 'base'), true);
	}

	public static points(skill: Skill): SkillProperty {
		return new SkillProperty(skill, new Reference(skill.id, 'points'), false);
	}
}

export type Property = AttributeProperty | SkillProperty;