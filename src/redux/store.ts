import Redux, { createStore } from 'redux';
import { Action } from "redux/actions/root";
import { State, Reducer } from "redux/reducers/root";

export type Store = Redux.Store<State>;
export type Reducer = Redux.Reducer<State>;
export type Dispatch = Redux.Dispatch<State>;
export { Action, State };

export default createStore(Reducer as Reducer);