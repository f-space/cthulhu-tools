import { ProfileState, INITIAL_STATE } from "redux/states/profile";
import { Action } from "redux/actions/root";
import { ProfileActionType } from "redux/actions/profile";

export function ProfileReducer(state: ProfileState = INITIAL_STATE, action: Action): ProfileState {
	switch (action.type) {
		case ProfileActionType.Set:
			{
				const { profile } = action;
				const array = Array.isArray(profile) ? profile : [profile];

				return {
					...state,
					profiles: state.profiles.withMutations(s => array.forEach(pro => s.set(pro.uuid, pro))),
				};
			}
		case ProfileActionType.Delete:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return {
					...state,
					profiles: state.profiles.withMutations(s => array.forEach(uuid => s.delete(uuid))),
				};
			}
		case ProfileActionType.SetDefault:
			{
				const { uuid } = action;

				return {
					...state,
					default: uuid,
				};
			}
		case ProfileActionType.SetLoadState:
			{
				const { state: loadState } = action;

				return {
					...state,
					loadState,
				};
			}
		default:
			return state;
	}
}