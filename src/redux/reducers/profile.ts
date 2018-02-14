import { Map } from 'immutable';
import { Profile } from "models/status";
import { Action } from "redux/actions/root";
import { PROFILE_SET, PROFILE_DELETE, PROFILE_SET_DEFAULT } from "redux/actions/profile";

export interface ProfileState {
	profiles: Map<string, Profile>;
	default: string | null;
}

export function ProfileReducer(state: ProfileState = { profiles: Map(), default: null }, action: Action): ProfileState {
	switch (action.type) {
		case PROFILE_SET:
			return {
				profiles: state.profiles.set(action.profile.uuid, action.profile),
				default: state.default,
			};
		case PROFILE_DELETE:
			return {
				profiles: state.profiles.delete(action.uuid),
				default: state.default,
			};
		case PROFILE_SET_DEFAULT:
			return {
				profiles: state.profiles,
				default: action.uuid,
			};
		default:
			return state;
	}
}