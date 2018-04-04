import { Map } from 'immutable';
import { Profile } from "models/status";
import { Action } from "redux/actions/root";
import { ProfileActionType } from "redux/actions/profile";

export interface ProfileState {
	profiles: Map<string, Profile>;
	default: string | null;
}

export function ProfileReducer(state: ProfileState = { profiles: Map(), default: null }, action: Action): ProfileState {
	switch (action.type) {
		case ProfileActionType.Set:
			{
				const { profile } = action;
				const array = Array.isArray(profile) ? profile : [profile];

				return {
					profiles: state.profiles.withMutations(s => array.forEach(pro => s.set(pro.uuid, pro))),
					default: state.default,
				};
			}
		case ProfileActionType.Delete:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return {
					profiles: state.profiles.withMutations(s => array.forEach(uuid => s.delete(uuid))),
					default: state.default,
				};
			}
		case ProfileActionType.SetDefault:
			{
				const { uuid } = action;

				return {
					profiles: state.profiles,
					default: uuid,
				};
			}
		default:
			return state;
	}
}