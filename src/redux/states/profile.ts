import { Map } from 'immutable';
import { Profile } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export interface ProfileState {
	profiles: Map<string, Profile>;
	default: string | null;
	loadState: LoadState;
}

export const INITIAL_STATE: ProfileState = {
	profiles: Map(),
	default: null,
	loadState: 'unloaded',
};