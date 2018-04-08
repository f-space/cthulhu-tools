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
					skills: state.skills.withMutations(s => array.forEach(skill => s.set(skill.uuid, skill))),
				};
			}
		case SkillActionType.Delete:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return {
					...state,
					skills: state.skills.withMutations(s => array.forEach(uuid => s.delete(uuid))),
				};
			}
		default:
			return state;
	}
}