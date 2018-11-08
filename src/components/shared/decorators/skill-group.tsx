import React from 'react';
import { Skill, SkillCategory } from 'models/status';

export interface SkillGroupProps {
	skills: ReadonlyArray<Skill>;
	children: (groups: SkillGroupItem, index: number) => React.ReactNode;
}

export interface SkillGroupItem {
	readonly category: SkillCategory;
	readonly skills: ReadonlyArray<Skill>;
}

export function SkillGroup({ skills, children }: SkillGroupProps) {
	return <>{processWithCache(skills).map(children)}</>;
}

const CACHE = new WeakMap<ReadonlyArray<Skill>, ReadonlyArray<SkillGroupItem>>();

function processWithCache(skills: ReadonlyArray<Skill>): ReadonlyArray<SkillGroupItem> {
	let value = CACHE.get(skills);
	if (value === undefined) CACHE.set(skills, value = process(skills));
	return value;
}

function process(skills: ReadonlyArray<Skill>): SkillGroupItem[] {
	return sort([...group(skills)]).map(([category, skills]) => ({ category, skills }));
}

function group(skills: ReadonlyArray<Skill>): Map<SkillCategory, Skill[]> {
	return skills.reduce((groups, skill) => {
		const items = groups.get(skill.category);
		if (items) {
			items.push(skill);
		} else {
			groups.set(skill.category, [skill]);
		}
		return groups;
	}, new Map<SkillCategory, Skill[]>());
}

function sort(groups: [SkillCategory, Skill[]][]): [SkillCategory, Skill[]][] {
	groups.sort((x, y) => SkillCategory.compare(x[0], y[0]));
	groups.forEach(group => group[1].sort((x, y) => String.prototype.localeCompare.call(x.name, y.name)));
	return groups;
}
