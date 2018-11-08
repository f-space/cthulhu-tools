import React from 'react';
import { SkillCategory as Category } from 'models/status';

const CATEGORY_NAME = {
	[Category.Locomotion]: "移動",
	[Category.Investigation]: "調査",
	[Category.Communication]: "対話",
	[Category.Knowledge]: "知識",
	[Category.Scholarship]: "学問",
	[Category.Language]: "言語",
	[Category.Combat]: "戦闘",
	[Category.Special]: "特殊",
	[Category.Other]: "その他",
};

export interface SkillCategoryProps {
	category: Category;
}

export function SkillCategory({ category }: SkillCategoryProps) {
	return <>{getSkillCategoryName(category)}</>;
}

export function getSkillCategoryName(category: Category): string {
	return CATEGORY_NAME[category];
}