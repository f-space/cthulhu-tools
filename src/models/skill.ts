import * as validation from "models/validation";

export enum SkillCategory {
	locomotion = 'locomotion',
	exploration = 'exploration',
	knowledge = 'knowledge',
	communication = 'communication',
	language = 'language',
	combat = 'combat',
	special = 'special',
	other = 'other',
};

export interface SkillData {
	readonly id: string;
	readonly name: string;
	readonly category: SkillCategory;
	readonly dependencies?: ReadonlyArray<string>;
	readonly base: number | string;
}

export class Skill implements SkillData {
	public readonly id: string;
	public readonly name: string;
	public readonly category: SkillCategory;
	public readonly dependencies: ReadonlyArray<string>;
	public readonly base: number | string;
	public readonly readonly: boolean;

	public constructor({ id, name, category, dependencies, base }: SkillData, readonly?: boolean) {
		this.id = validation.string(id);
		this.name = validation.string(name);
		this.category = validation.string_literal(SkillCategory[category] || SkillCategory.other);
		this.dependencies = validation.array(dependencies, validation.string);
		this.base = validation.or(validation.int_string(base), 0);
		this.readonly = Boolean(readonly);
	}

	public toJSON(): SkillData {
		return {
			id: this.id,
			name: this.name,
			category: this.category,
			dependencies: this.dependencies,
			base: this.base,
		};
	}
}