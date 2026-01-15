import { combineReducers } from 'redux';
import { ConfigReducer } from "redux/reducers/config";
import { StatusReducer } from "redux/reducers/status";

export const Reducer = combineReducers({
	config: ConfigReducer,
	status: StatusReducer,
});