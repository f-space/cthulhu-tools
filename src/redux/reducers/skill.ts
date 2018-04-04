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
			{
				const { skill } = action;
				const array = Array.isArray(skill) ? skill : [skill];

				return { skills: state.skills.withMutations(s => array.forEach(skill => s.set(skill.id, skill))) };
			}
		case SKILL_DELETE:
			{
				const { id } = action;
				const array = Array.isArray(id) ? id : [id];

				return { skills: state.skills.withMutations(s => array.forEach(id => s.delete(id))) };
			}
		default:
			return state;
	}
}