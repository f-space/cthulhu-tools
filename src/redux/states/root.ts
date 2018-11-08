import { ConfigState } from "redux/states/config";
import { StatusState } from "redux/states/status";

export interface State {
	config: ConfigState;
	status: StatusState;
}