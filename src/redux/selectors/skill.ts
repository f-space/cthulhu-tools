import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Skill, SkillProvider } from "models/status";
import { SkillState } from "redux/reducers/skill";

class Provider implements SkillProvider {
	constructor(readonly skills: Map<string, Skill>) { }

	public get(id: string): Skill | undefined;
	public get(ids: string[]): Skill[];
	public get(ids: string | string[]): Skill | Skill[] | undefined {
		return Array.isArray(ids)
			? ids.map(id => this.skills.get(id)).filter(x => x !== undefined)
			: this.skills.get(ids);
	}

	public list(): Skill[] { return [...this.skills.values() as IterableIterator<Skill>]; }
}

export const getSkillProvider = createSelector(
	(state: SkillState) => state.skills,
	(skills) => new Provider(skills)
);
