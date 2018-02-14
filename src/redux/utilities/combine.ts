import { combineReducers } from 'redux';

export type Reducer<S, A> = (state: S | undefined, action: A) => S;
export type ReducersMapObject<S, A> = {[P in keyof S]: Reducer<S[P], A> };
export type ReducerCombiner = <S, A>(reducers: ReducersMapObject<S, A>) => Reducer<S, A>;

export default combineReducers as ReducerCombiner;