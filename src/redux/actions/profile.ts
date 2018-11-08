import { Profile } from "models/status";

export enum ProfileActionType {
	Set = '[profile]::set',
	Delete = '[profile]::delete',
	SetDefault = '[profile]::setDefault',
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

export type ProfileAction =
	| ProfileSetAction
	| ProfileDeleteAction
	| ProfileSetDefaultAction

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
}