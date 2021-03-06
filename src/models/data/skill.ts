import { Hash } from "./hash";
import { Expression } from "./expression";
import { validate } from "./validation";

const SKILL_CATEGORIES = [
	'locomotion' as 'locomotion',
	'investigation' as 'investigation',
	'communication' as 'communication',
	'knowledge' as 'knowledge',
	'scholarship' as 'scholarship',
	'language' as 'language',
	'combat' as 'combat',
	'special' as 'special',
	'other' as 'other',
];
const SKILL_CATEGORY_ORDER = new Map(SKILL_CATEGORIES.map((v, i) => [v, i] as [SkillCategory, number]));
const SKILL_CATEGORY_SET = new Set(SKILL_CATEGORIES);

export type SkillCategory = typeof SKILL_CATEGORIES extends (infer T)[] ? T : never;

export const SkillCategory = {
	compare(x: SkillCategory, y: SkillCategory): number {
		const xorder = SKILL_CATEGORY_ORDER.get(x);
		const yorder = SKILL_CATEGORY_ORDER.get(y);

		return xorder === undefined
			? (yorder === undefined ? 0 : -1)
			: (yorder === undefined ? 1 : xorder - yorder);
	},
}

export interface SkillData {
	readonly uuid: string;
	readonly id: string;
	readonly name: string;
	readonly category: SkillCategory;
	readonly base: string;
}

export interface SkillConfig {
	readonly uuid: string;
	readonly id: string;
	readonly name: string;
	readonly category: SkillCategory;
	readonly base: Expression;
}

export class Skill implements SkillConfig {
	public readonly uuid: string;
	public readonly id: string;
	public readonly name: string;
	public readonly category: SkillCategory;
	public readonly base: Expression;
	public readonly readonly: boolean;

	public get hash(): string { return Hash.get(this).hex; }

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
			uuid: validate("uuid", uuid).string().uuid().value,
			id: validate("id", id).string().id().value,
			name: validate("name", name).string().nonempty().value,
			category: validate("category", category).enum(SKILL_CATEGORY_SET).value,
			base: validate("base", base).string().expr().value,
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