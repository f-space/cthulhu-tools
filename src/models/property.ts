import { Attribute } from "models/attribute";
import { Skill } from "models/skill";

interface PropertyInterface {
	readonly type: string;
	readonly view: boolean;
}

export class AttributeValueProperty implements PropertyInterface {
	public get type(): 'attribute' { return 'attribute'; }
	public get view(): boolean { return this.attribute.view; }
	public constructor(readonly attribute: Attribute) { }
}

export class AttributeMinProperty implements PropertyInterface {
	public get type(): 'attribute:min' { return 'attribute:min'; }
	public get view(): boolean { return true; }
	public constructor(readonly attribute: Attribute) { }
}

export class AttributeMaxProperty implements PropertyInterface {
	public get type(): 'attribute:max' { return 'attribute:max'; }
	public get view(): boolean { return true; }
	public constructor(readonly attribute: Attribute) { }
}

export class SkillValueProperty implements PropertyInterface {
	public get type(): 'skill' { return 'skill'; }
	public get view(): boolean { return true; }
	public constructor(readonly skill: Skill) { }
}

export class SkillBaseProperty implements PropertyInterface {
	public get type(): 'skill:base' { return 'skill:base'; }
	public get view(): boolean { return true; }
	public constructor(readonly skill: Skill) { }
}

export class SkillPointsProperty implements PropertyInterface {
	public get type(): 'skill:points' { return 'skill:points'; }
	public get view(): boolean { return false; }
	public constructor(readonly skill: Skill) { }
}

export type Property = AttributeProperty | SkillProperty;
export type AttributeProperty = AttributeValueProperty | AttributeMinProperty | AttributeMaxProperty;
export type SkillProperty = SkillValueProperty | SkillBaseProperty | SkillPointsProperty;

export type PropertyType = Property['type'];
export type AttributePropertyType = AttributeProperty['type'];
export type SkillPropertyType = SkillProperty['type'];