import Vue from 'vue';
import { SkillData, Skill, SkillProvider } from "models/status";
import DB from "models/storage";
import { Module, Getter, Mutation, Action } from "modules/vuex-class-module";
import BUILTIN_SKILLS_URL from "@resource/data/skills.json";

type SkillTable = { [id: string]: Skill };

@Module({ namespaced: true })
export default class SkillModule implements SkillProvider {
	public skills: SkillTable = Object.create(null);

	@Getter
	public get provider(): SkillProvider { return this; }

	@Mutation
	public set_skill(skill: Skill): void {
		Vue.set(this.skills, skill.id, skill);
	}

	@Mutation
	public delete_skill(id: string): void {
		Vue.delete(this.skills, id);
	}

	@Action
	public async create(skill: Skill): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.add(skill.toJSON());
		}).then(() => {
			this.set_skill(skill);
		});
	}

	@Action
	public async update(skill: Skill): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.update(skill.id, skill.toJSON());
		}).then(() => {
			this.set_skill(skill);
		});
	}

	@Action
	public async delete(id: string): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.delete(id);
		}).then(() => {
			this.delete_skill(id);
		});
	}

	@Action
	public async load(): Promise<void> {
		await this.loadBuiltins();
		await DB.transaction("r", DB.skills, () => {
			return DB.skills.toArray();
		}).then(skills => {
			for (const skill of skills) {
				this.set_skill(new Skill(skill));
			}
		});
	}

	@Action
	public async loadBuiltins(url: string = BUILTIN_SKILLS_URL): Promise<void> {
		await fetch(url).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(`${response.statusText}: ${url}`);
			}
		}).then(data => {
			const skills = (Array.isArray(data) ? data : [data]) as SkillData[];
			for (const skill of skills) {
				this.set_skill(new Skill(skill, true));
			}
		});
	}

	public get(id: string): Skill | undefined;
	public get(ids: string[]): Skill[];
	public get(ids: string | string[]): Skill | Skill[] | undefined {
		return Array.isArray(ids)
			? ids.map(id => this.skills[id]).filter(x => x !== undefined)
			: this.skills[ids];
	}

	public list() { return Object.values(this.skills); }
}