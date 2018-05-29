import { Expression } from "./expression";
import * as validation from "./validation";

export enum SkillCategory {
	Locomotion = 'locomotion',
	Investigation = 'investigation',
	Knowledge = 'knowledge',
	Communication = 'communication',
	Language = 'language',
	Combat = 'combat',
	Special = 'special',
	Other = 'other',
};

const SKILL_CATEGORY_SET = new Set<SkillCategory>(Object.values(SkillCategory));

export interface SkillData {
	readonly uuid: string;
	readonly id: string;
	readonly name: string;
	readonly category: SkillCategory;
	readonly base: number | string;
}

export interface SkillConfig {
	readonly uuid: string;
	readonly id: string;
	readonly name: string;
	readonly category: SkillCategory;
	readonly base: Expression;
}

export class Skill {
	public readonly uuid: string;
	public readonly id: string;
	public readonly name: string;
	public readonly category: SkillCategory;
	public readonly base: Expression;
	public readonly readonly: boolean;

	public constructor({ uuid, id, name, category, base }: SkillConfig, readonly?: boolean) {
		this.uuid = uuid;
		this.id = id;
		this.name = name;
		this.category = category;
		this.base = base;
		this.readonly = Boolean(readonly);
	}

	public static from({ uuid, id, name, category, base }: SkillData, readonly?: boolean) {
		return new Skill({
			uuid: validation.uuid(uuid),
			id: validation.string(id),
			name: validation.string(name),
			category: validation.string_enum(SKILL_CATEGORY_SET.has(category) ? category : SkillCategory.Other),
			base: validation.expression(base),
		}, readonly);
	}

	public toJSON(): SkillData {
		return {
			uuid: this.uuid,
			id: this.id,
			name: this.name,
			category: this.category,
			base: this.base.toJSON(),
		};
	}

	public set(config: Partial<SkillConfig>, readonly?: boolean): Skill {
		const { uuid, id, name, category, base } = this;

		return new Skill({ uuid, id, name, category, base, ...config }, readonly);
	}
}