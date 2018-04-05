import { Map } from 'immutable';
import { Attribute } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export interface AttributeState {
	attributes: Map<string, Attribute>;
	loadState: LoadState;
}

export const INITIAL_STATE: AttributeState = {
	attributes: Map(),
	loadState: 'unloaded',
};