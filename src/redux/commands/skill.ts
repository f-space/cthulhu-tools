import { SkillData, Skill } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { setSkill, deleteSkill } from "redux/actions/skill";
import BUILTIN_SKILLS_URL from "@resource/data/skills.json";

export default class SkillCommand {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(skill: Skill): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.add(skill.toJSON());
		}).then(() => {
			this.dispatch(setSkill(skill));
		});
	}

	public async update(skill: Skill): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.update(skill.id, skill.toJSON());
		}).then(() => {
			this.dispatch(setSkill(skill));
		});
	}

	public async delete(id: string): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.delete(id);
		}).then(() => {
			this.dispatch(deleteSkill(id));
		});
	}

	public async load(): Promise<void> {
		await this.loadBuiltins();
		await DB.transaction("r", DB.skills, () => {
			return DB.skills.toArray();
		}).then(skills => {
			for (const skill of skills) {
				this.dispatch(setSkill(new Skill(skill)));
			}
		});
	}

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
				this.dispatch(setSkill(new Skill(skill, true)));
			}
		});
	}
}