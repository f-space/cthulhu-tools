import { Profile } from "models/status";

export const PROFILE_SET = "profile/set";
export const PROFILE_DELETE = "profile/delete";
export const PROFILE_SET_DEFAULT = "profile/set-default";

export interface ProfileSetAction {
	readonly type: typeof PROFILE_SET;
	readonly profile: Profile;
}

export interface ProfileDeleteAction {
	readonly type: typeof PROFILE_DELETE;
	readonly uuid: string;
}

export interface ProfileSetDefaultAction {
	readonly type: typeof PROFILE_SET_DEFAULT;
	readonly uuid: string;
}

export type ProfileAction = ProfileSetAction | ProfileDeleteAction | ProfileSetDefaultAction;

export function setProfile(profile: Profile): ProfileSetAction {
	return {
		type: PROFILE_SET,
		profile,
	};
}

export function deleteProfile(uuid: string): ProfileDeleteAction {
	return {
		type: PROFILE_DELETE,
		uuid,
	};
}

export function setDefaultProfile(uuid: string): ProfileSetDefaultAction {
	return {
		type: PROFILE_SET_DEFAULT,
		uuid,
	};
}