import { combineReducers } from 'redux';
import { State } from "redux/states/root";
import { Action } from "redux/actions/root";
import { StatusReducer } from "redux/reducers/status";

export const Reducer = combineReducers<State, Action>({
	status: StatusReducer,
});