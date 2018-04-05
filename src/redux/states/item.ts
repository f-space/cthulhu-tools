import { Map } from 'immutable';
import { Item } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export interface ItemState {
	items: Map<string, Item>;
	loadState: LoadState;
}

export const INITIAL_STATE: ItemState = {
	items: Map(),
	loadState: 'unloaded',
};