import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Skill, SkillProvider } from "models/status";
import { State } from "redux/store";

class Provider implements SkillProvider {
	constructor(readonly skills: Map<string, Skill>) { }

	public get(id: string): Skill | undefined;
	public get(ids: string[]): Skill[];
	public get(ids: string | string[]): Skill | Skill[] | undefined {
		return Array.isArray(ids)
			? ids.map(id => this.skills.get(id)).filter(x => x !== undefined) as Skill[]
			: this.skills.get(ids);
	}

	public list(): Skill[] { return [...this.skills.values()]; }
}

export const getSkillState = (state: State) => state.skill;

export const getSkills = createSelector(getSkillState, state => state.skills);

export const getSkillProvider = createSelector(getSkills, skills => new Provider(skills));