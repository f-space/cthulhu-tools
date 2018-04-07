import { Map } from 'immutable';
import { Skill } from "models/status";

export interface SkillState {
	skills: Map<string, Skill>;
}

export const INITIAL_SKILL_STATE: SkillState = {
	skills: Map(),
};