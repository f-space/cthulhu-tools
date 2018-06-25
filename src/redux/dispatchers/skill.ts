import { SkillData, Skill } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { SkillAction } from "redux/actions/skill";
import BUILTIN_SKILLS_URL from "assets/data/skills.json";

export default class SkillDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(skill: Skill): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.add(skill.toJSON());
		}).then(() => {
			this.dispatch(SkillAction.set(skill));
		});
	}

	public async update(skill: Skill): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.update(skill.uuid, skill.toJSON());
		}).then(() => {
			this.dispatch(SkillAction.set(skill));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.skills, () => {
			return DB.skills.delete(uuid);
		}).then(() => {
			this.dispatch(SkillAction.delete(uuid));
		});
	}

	public async load(): Promise<void> {
		await this.loadBuiltins();
		await DB.transaction("r", DB.skills, () => {
			return DB.skills.toArray();
		}).then(skills => {
			this.dispatch(SkillAction.set(this.validate(skills)));
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
			this.dispatch(SkillAction.set(this.validate(skills, true)));
		});
	}

	private validate(skills: ReadonlyArray<SkillData>, readonly?: boolean): Skill[] {
		const result = [] as Skill[];
		for (const skill of skills) {
			try {
				result.push(Skill.from(skill, readonly));
			} catch (e) {
				if (e instanceof Error) {
					console.error(`Failed to load a skill: ${e.message}`);
				} else throw e;
			}
		}
		return result;
	}
}