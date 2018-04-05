import { Map } from 'immutable';
import { Skill } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export interface SkillState {
	skills: Map<string, Skill>;
	loadState: LoadState;
}

export const INITIAL_STATE: SkillState = {
	skills: Map(),
	loadState: 'unloaded',
};