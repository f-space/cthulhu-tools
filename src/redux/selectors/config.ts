import { createSelector } from 'reselect';
import { State } from "redux/store";

export const getConfig = (state: State) => state.config;

export const getMuted = createSelector(getConfig, state => state.muted);