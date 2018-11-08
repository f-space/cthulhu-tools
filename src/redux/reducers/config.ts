import { ConfigState, INITIAL_CONFIG_STATE } from "redux/states/config";
import { Action } from "redux/actions/root";
import { ConfigActionType } from "redux/actions/config";

export function ConfigReducer(state: ConfigState = INITIAL_CONFIG_STATE, action: Action): ConfigState {
	switch (action.type) {
		case ConfigActionType.Mute:
			{
				const { value: muted } = action;

				return { ...state, muted };
			}
		default:
			return state;
	}
}