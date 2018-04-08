import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Skill, SkillProvider } from "models/status";
import { State } from "redux/store";

class Provider implements SkillProvider {
	constructor(readonly skills: Map<string, Skill>) { }

	public get(uuid: string): Skill | undefined;
	public get(uuids: string[]): Skill[];
	public get(uuids: string | string[]): Skill | Skill[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.skills.get(uuid)).filter(x => x !== undefined) as Skill[]
			: this.skills.get(uuids);
	}

	public list(): Skill[] { return [...this.skills.values()]; }
}

export const getSkillState = (state: State) => state.status.skill;

export const getSkills = createSelector(getSkillState, state => state.skills);

export const getSkillProvider = createSelector(getSkills, skills => new Provider(skills));