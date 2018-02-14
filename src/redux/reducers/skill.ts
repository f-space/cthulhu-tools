import { Map } from 'immutable';
import { Skill } from "models/status";
import { Action } from "redux/actions/root";
import { SKILL_SET, SKILL_DELETE } from "redux/actions/skill";

export interface SkillState {
	skills: Map<string, Skill>;
}

export function SkillReducer(state: SkillState = { skills: Map() }, action: Action): SkillState {
	switch (action.type) {
		case SKILL_SET:
			return { skills: state.skills.set(action.skill.id, action.skill) };
		case SKILL_DELETE:
			return { skills: state.skills.delete(action.id) };
		default:
			return state;
	}
}