import * as Config from "models/config";
import { Dispatch } from "redux/store";
import { ConfigAction } from "redux/actions/config";

export default class ConfigDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public mute(value: boolean): void {
		Config.muted(value);

		this.dispatch(ConfigAction.mute(value));
	}
}