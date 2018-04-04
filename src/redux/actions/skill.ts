import { Skill } from "models/status";

export const SKILL_SET = "skill/set";
export const SKILL_DELETE = "skill/delete";

export interface SkillSetAction {
	readonly type: typeof SKILL_SET;
	readonly skill: Skill | Skill[];
}

export interface SkillDeleteAction {
	readonly type: typeof SKILL_DELETE;
	readonly id: string | string[];
}

export type SkillAction = SkillSetAction | SkillDeleteAction;

export function setSkill(skill: Skill | Skill[]): SkillSetAction {
	return {
		type: SKILL_SET,
		skill,
	};
}

export function deleteSkill(id: string | string[]): SkillDeleteAction {
	return {
		type: SKILL_DELETE,
		id,
	};
}