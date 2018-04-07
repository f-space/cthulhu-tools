import { Map } from 'immutable';
import { Profile } from "models/status";

export interface ProfileState {
	profiles: Map<string, Profile>;
	default: string | null;
}

export const INITIAL_PROFILE_STATE: ProfileState = {
	profiles: Map(),
	default: null,
};