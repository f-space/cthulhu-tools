import React from 'react';
import { SkillCategory as Category } from 'models/status';

const CATEGORY_NAME = {
	'locomotion': "移動",
	'investigation': "調査",
	'communication': "対話",
	'knowledge': "知識",
	'scholarship': "学問",
	'language': "言語",
	'combat': "戦闘",
	'special': "特殊",
	'other': "その他",
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