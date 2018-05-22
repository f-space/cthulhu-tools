import { Character } from "./character";
import { Profile } from "./profile";
import { Attribute } from "./attribute";
import { Skill } from "./skill";
import { History } from "./history";
import { DataProvider } from "./provider";

export interface CharacterContext {
	readonly character: Character;
	readonly profile: ProfileContext;
	readonly history: History | null;
}

export interface ProfileContext {
	readonly profile: Profile;
	readonly attributes: ReadonlyArray<Attribute>;
	readonly skills: ReadonlyArray<Skill>;
}

export interface CollectionResultOK<T> {
	value: T;
	error?: undefined;
}

export interface CollectionResultError {
	value?: undefined;
	error: ReadonlyArray<string>;
}

export type CollectionResult<T> = CollectionResultOK<T> | CollectionResultError;

export class DataCollector {
	constructor(readonly provider: DataProvider) { }

	public resolveCharacter(uuid: string): CollectionResult<CharacterContext> {
		const characterResult = this.getCharacter(uuid);
		if (!characterResult.error) {
			const character = characterResult.value!;
			const profileResult = this.resolveProfile(character.profile);
			const historyResult = this.getHistory(character.history)
			if (!profileResult.error && !historyResult.error!) {
				const profile = profileResult.value!;
				const history = historyResult.value!;
				return { value: { character, profile, history } };
			}
			return this.mergeErrors(profileResult, historyResult);
		}
		return characterResult as CollectionResultError;
	}

	public resolveProfile(uuid: string): CollectionResult<ProfileContext> {
		const profileResult = this.getProfile(uuid);
		if (!profileResult.error) {
			const profile = profileResult.value!;
			const attributeResult = this.getList(profile.attributes, this.getAttribute);
			const skillResult = this.getList(profile.skills, this.getSkill);
			if (!attributeResult.error && !skillResult.error) {
				const attributes = attributeResult.value!;
				const skills = skillResult.value!;
				return { value: { profile, attributes, skills } };
			}
			return this.mergeErrors(attributeResult, skillResult);
		}
		return profileResult as CollectionResultError;
	}

	public getCharacter(uuid: string): CollectionResult<Character> {
		const value = this.provider.character.get(uuid);

		return (value !== undefined ? { value } : { error: [uuid] });
	}

	public getProfile(uuid: string): CollectionResult<Profile> {
		const value = this.provider.profile.get(uuid);

		return (value !== undefined ? { value } : { error: [uuid] });
	}

	public getAttribute(uuid: string): CollectionResult<Attribute> {
		const value = this.provider.attribute.get(uuid);

		return (value !== undefined ? { value } : { error: [uuid] });
	}

	public getSkill(uuid: string): CollectionResult<Skill> {
		const value = this.provider.skill.get(uuid);

		return (value !== undefined ? { value } : { error: [uuid] });
	}

	public getList<T>(uuids: ReadonlyArray<string>, getter: (this: DataCollector, uuid: string) => CollectionResult<T>): CollectionResult<ReadonlyArray<T>> {
		const results = uuids.map(getter.bind(this) as typeof getter);
		if (results.every(result => !result.error)) {
			return { value: results.map(result => result.value!) };
		}
		return this.mergeErrors(...results);
	}

	public getHistory(uuid: string | null): CollectionResult<History | null> {
		const value = uuid !== null ? this.provider.history.get(uuid) : null;

		return (value !== undefined ? { value } : { error: [uuid!] });
	}

	public mergeErrors(...results: CollectionResult<any>[]): CollectionResultError {
		return { error: ([] as string[]).concat(...results.map(result => result.error || [])) };
	}
}