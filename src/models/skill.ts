import { Expression } from "models/expression";
import * as validation from "models/validation";

export enum SkillCategory {
	locomotion = 'locomotion',
	investigation = 'investigation',
	knowledge = 'knowledge',
	communication = 'communication',
	language = 'language',
	combat = 'combat',
	special = 'special',
	other = 'other',
};

export interface SkillData {
	readonly uuid?: string;
	readonly id: string;
	readonly name: string;
	readonly category: SkillCategory;
	readonly base: number | string;
}

export class Skill {
	public readonly uuid: string;
	public readonly id: string;
	public readonly name: string;
	public readonly category: SkillCategory;
	public readonly base: Expression;
	public readonly readonly: boolean;

	public constructor({ uuid, id, name, category, base }: SkillData, readonly?: boolean) {
		this.uuid = validation.uuid(uuid);
		this.id = validation.string(id);
		this.name = validation.string(name);
		this.category = validation.string_literal(SkillCategory[category] || SkillCategory.other);
		this.base = validation.expression(base);
		this.readonly = Boolean(readonly);
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
}