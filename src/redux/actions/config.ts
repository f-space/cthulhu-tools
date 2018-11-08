export enum ConfigActionType {
	Mute = '[config]::mute',
}

export interface ConfigMuteAction {
	readonly type: ConfigActionType.Mute;
	readonly value: boolean;
}

export type ConfigAction = ConfigMuteAction;

export const ConfigAction = {
	mute(value: boolean): ConfigMuteAction {
		return { type: ConfigActionType.Mute, value };
	},
}