import { SkillState, INITIAL_SKILL_STATE } from "redux/states/skill";
import { Action } from "redux/actions/root";
import { SkillActionType } from "redux/actions/skill";

export function SkillReducer(state: SkillState = INITIAL_SKILL_STATE, action: Action): SkillState {
	switch (action.type) {
		case SkillActionType.Set:
			{
				const { skill } = action;
				const array = Array.isArray(skill) ? skill : [skill];

				return {
					...state,
					skills: state.skills.withMutations(s => array.forEach(skill => s.set(skill.id, skill))),
				};
			}
		case SkillActionType.Delete:
			{
				const { id } = action;
				const array = Array.isArray(id) ? id : [id];

				return {
					...state,
					skills: state.skills.withMutations(s => array.forEach(id => s.delete(id))),
				};
			}
		default:
			return state;
	}
}