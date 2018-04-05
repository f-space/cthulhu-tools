import { Skill } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export enum SkillActionType {
	Set = '[skill]::set',
	Delete = '[skill]::delete',
	SetLoadState = '[skill]::setLoadState',
}

export interface SkillSetAction {
	readonly type: SkillActionType.Set;
	readonly skill: Skill | Skill[];
}

export interface SkillDeleteAction {
	readonly type: SkillActionType.Delete;
	readonly id: string | string[];
}

export interface SkillSetLoadStateAction {
	readonly type: SkillActionType.SetLoadState;
	readonly state: LoadState;
}

export type SkillAction =
	| SkillSetAction
	| SkillDeleteAction
	| SkillSetLoadStateAction

export const SkillAction = {
	set(skill: Skill | Skill[]): SkillSetAction {
		return { type: SkillActionType.Set, skill };
	},
	delete(id: string | string[]): SkillDeleteAction {
		return { type: SkillActionType.Delete, id };
	},
	setLoadState(state: LoadState): SkillSetLoadStateAction {
		return { type: SkillActionType.SetLoadState, state };
	},
}