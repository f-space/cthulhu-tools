import { combineReducers } from 'redux';
import { State } from "redux/states/root";
import { Action } from "redux/actions/root";
import { ConfigReducer } from "redux/reducers/config";
import { StatusReducer } from "redux/reducers/status";

export const Reducer = combineReducers<State, Action>({
	config: ConfigReducer,
	status: StatusReducer,
});