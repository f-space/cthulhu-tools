import Redux, { createStore } from 'redux';
import { Reducer } from "redux/reducers/root";

const store = createStore(Reducer);

export type Store = typeof store;
export type State = Store extends Redux.Store<infer S, any> ? S : never;
export type Action = Store extends Redux.Store<any, infer A> ? A : never;
export type Reducer = Redux.Reducer<State, Action>;
export type Dispatch = Redux.Dispatch<Action>;

export default store;