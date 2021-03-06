import { Skill } from "models/status";

export enum SkillActionType {
	Set = '[skill]::set',
	Delete = '[skill]::delete',
}

export interface SkillSetAction {
	readonly type: SkillActionType.Set;
	readonly skill: Skill | Skill[];
}

export interface SkillDeleteAction {
	readonly type: SkillActionType.Delete;
	readonly uuid: string | string[];
}

export type SkillAction =
	| SkillSetAction
	| SkillDeleteAction

export const SkillAction = {
	set(skill: Skill | Skill[]): SkillSetAction {
		return { type: SkillActionType.Set, skill };
	},
	delete(uuid: string | string[]): SkillDeleteAction {
		return { type: SkillActionType.Delete, uuid };
	},
}