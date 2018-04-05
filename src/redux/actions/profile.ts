import { Profile } from "models/status";
import { LoadState } from "redux/states/profile";

export enum ProfileActionType {
	Set = '[profile]::set',
	Delete = '[profile]::delete',
	SetDefault = '[profile]::setDefault',
	SetLoadState = '[profile]::setLoadState',
}

export interface ProfileSetAction {
	readonly type: ProfileActionType.Set;
	readonly profile: Profile | Profile[];
}

export interface ProfileDeleteAction {
	readonly type: ProfileActionType.Delete;
	readonly uuid: string | string[];
}

export interface ProfileSetDefaultAction {
	readonly type: ProfileActionType.SetDefault;
	readonly uuid: string;
}

export interface ProfileSetLoadStateAction {
	readonly type: ProfileActionType.SetLoadState;
	readonly state: LoadState;
}

export type ProfileAction =
	| ProfileSetAction
	| ProfileDeleteAction
	| ProfileSetDefaultAction
	| ProfileSetLoadStateAction

export const ProfileAction = {
	set(profile: Profile | Profile[]): ProfileSetAction {
		return { type: ProfileActionType.Set, profile };
	},
	delete(uuid: string | string[]): ProfileDeleteAction {
		return { type: ProfileActionType.Delete, uuid };
	},
	setDefault(uuid: string): ProfileSetDefaultAction {
		return { type: ProfileActionType.SetDefault, uuid };
	},
	setLoadState(state: LoadState): ProfileSetLoadStateAction {
		return { type: ProfileActionType.SetLoadState, state };
	},
}