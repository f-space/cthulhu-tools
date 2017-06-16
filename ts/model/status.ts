import { PropertyProvider, PropertyEvaluator, PropertyResolver, CompositeProvider, CompositeEvaluator } from "./property";
import { ProfileData, Profile, ProfileManager } from "./profile";
import { TypedAttributeData, Attribute, AttributeManager, AttributeProvider, AttributeEvaluator } from "./attribute";
import { InputDataSet } from "./input";
import { SkillData, Skill, SkillPointSet, SkillManager, SkillProvider, SkillEvaluator } from "./skill";
import { HistoryResolver } from "./operation";
import { CharacterData, Character, CharacterManager } from "./character";

const FORMAT = 'cthulhu-tools-status';
const VERSION = 0;

export interface StatusDataContent {
	readonly profiles?: ReadonlyArray<ProfileData>;
	readonly attributes?: ReadonlyArray<TypedAttributeData>;
	readonly skills?: ReadonlyArray<SkillData>;
	readonly characters?: ReadonlyArray<CharacterData>;
}

export interface StatusData extends StatusDataContent {
	readonly format: typeof FORMAT;
	readonly version: number;
}

export namespace StatusData {
	export function validate(data: any): data is StatusData {
		return (typeof data === 'object' && data.format === FORMAT && typeof data.version === 'number');
	}

	export function create(content: StatusDataContent, manager?: StatusManager): StatusData {
		if (manager !== undefined) {
			content = resolve(content, manager);
		}

		return Object.assign({
			format: FORMAT as typeof FORMAT,
			version: VERSION,
		}, content);
	}

	export function resolve(content: StatusDataContent, manager: StatusManager): StatusDataContent {
		const profiles = content.profiles ? Array.from(content.profiles) : [];
		const attributes = content.attributes ? Array.from(content.attributes) : [];
		const skills = content.skills ? Array.from(content.skills) : [];
		const characters = content.characters ? Array.from(content.characters) : [];

		const profileSet = new Set(profiles.map(x => x.uuid));
		const attributeSet = new Set(attributes.map(x => x.uuid));

		for (const character of characters) {
			const profile = manager.profiles.get(character.profile);
			if (profile && !profile.default && !profileSet.has(profile.uuid)) {
				profiles.push(profile);
				profileSet.add(profile.uuid);
			}
		}

		for (const profile of profiles) {
			const attributeList = manager.attributes.get(profile.attributes);
			for (const attribute of attributeList) {
				if (!attribute.default && !attributeSet.has(attribute.uuid)) {
					attributes.push(attribute);
					attributeSet.add(attribute.uuid);
				}
			}
		}

		return {
			profiles: (profiles.length !== 0 ? profiles : undefined),
			attributes: (attributes.length !== 0 ? attributes : undefined),
			skills: (skills.length !== 0 ? skills : undefined),
			characters: (characters.length !== 0 ? characters : undefined),
		};
	}
}

export class StatusManager {
	public readonly profiles: ProfileManager;
	public readonly attributes: AttributeManager;
	public readonly skills: SkillManager;
	public readonly characters: CharacterManager;

	public constructor(profiles: ProfileManager, attributes: AttributeManager, skills: SkillManager, characters: CharacterManager) {
		this.profiles = profiles;
		this.attributes = attributes;
		this.skills = skills;
		this.characters = characters;
	}

	public validateProfile(profile: Profile): boolean {
		return profile.attributes.every(x => this.attributes.contains(x));
	}

	public validateCharacter(character: Character): boolean {
		return this.profiles.contains(character.profile) && this.validateProfile(this.profiles.get(character.profile) as Profile);
	}

	public import(data: any): void {
		if (StatusData.validate(data)) {
			this.profiles.import(data.profiles);
			this.attributes.import(data.attributes);
			this.skills.import(data.skills);
			this.characters.import(data.characters);
		}
	}
}

export class StatusProvider extends CompositeProvider {
	public constructor(manager: StatusManager, profile: string) {
		const target = manager.profiles.get(profile);
		super([
			new AttributeProvider(manager.attributes, target ? target.attributes : []),
			new SkillProvider(manager.skills),
		]);
	}
}

export class StatusEvaluator extends CompositeEvaluator {
	public constructor(inputs: InputDataSet, points: SkillPointSet) {
		super([
			new AttributeEvaluator(inputs),
			new SkillEvaluator(points),
		]);
	}
}

export class StatusResolver implements PropertyResolver {
	public readonly base: HistoryResolver;
	public useCache: boolean;
	public get provider(): PropertyProvider { return this.base.provider; }
	public get evaluator(): PropertyEvaluator { return this.base.evaluator; }

	public constructor(manager: StatusManager, character: Character, useCache: boolean = true) {
		const provider = new StatusProvider(manager, character.profile);
		const evaluator = new StatusEvaluator(character.inputs, character.points);
		const history = character.history;

		this.base = new HistoryResolver(provider, evaluator, history);
		this.useCache = useCache;
	}

	public resolve(id: string, hash?: string | null): any {
		const result = this.base.resolve(id, hash);
		if (!this.useCache) this.base.clear();
		return result;
	}
}