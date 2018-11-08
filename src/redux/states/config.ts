import * as Config from "models/config";

export interface ConfigState {
	muted: boolean;
}

export const INITIAL_CONFIG_STATE: ConfigState = {
	muted: Config.muted(),
};