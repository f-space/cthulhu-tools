import { ConfigAction } from "redux/actions/config";
import { StatusAction } from "redux/actions/status";

export type Action =
	| ConfigAction
	| StatusAction