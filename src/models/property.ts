import { Attribute } from "models/attribute";
import { Skill } from "models/skill";

export type PropertyType = 'attribute' | 'skill';

interface EntityMap {
	'attribute': Attribute;
	'skill': Skill;
}

interface IProperty<T extends PropertyType> {
	readonly type: T;
	readonly entity: EntityMap[T];
	readonly id: string;
	readonly view: boolean;
}

export class AttributeProperty implements IProperty<'attribute'> {
	public get type(): 'attribute' { return 'attribute'; }
	public get id(): string { return this.entity.id; }
	public get view(): boolean { return this.entity.view; }
	public constructor(readonly entity: Attribute) { }
}

export class SkillProperty implements IProperty<'skill'>{
	public get type(): 'skill' { return 'skill'; }
	public get id(): string { return this.entity.id; }
	public get view(): false { return false; }
	public constructor(readonly entity: Skill) { }
}

export type Property = AttributeProperty | SkillProperty;
