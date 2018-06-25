import { validate } from "./validation";

export interface CharacterParamsData {
	readonly attribute?: AttributeParamsData;
	readonly skill?: SkillParamsData;
	readonly item?: ItemParamsData;
}

export interface AttributeParamsData {
	readonly [id: string]: InputParamsData
}

export interface InputParamsData {
	readonly [name: string]: any;
}

export interface SkillParamsData {
	readonly [id: string]: number;
}

export interface ItemParamsData {
	readonly [uuid: string]: number;
}

export interface CharacterParamsConfig {
	readonly attribute?: AttributeParams;
	readonly skill?: SkillParams;
	readonly item?: ItemParams;
}

export class CharacterParams implements CharacterParamsConfig {
	public readonly attribute: AttributeParams;
	public readonly skill: SkillParams;
	public readonly item: ItemParams;

	public constructor({ attribute, skill, item }: CharacterParamsConfig) {
		this.attribute = attribute !== undefined ? attribute : new Map();
		this.skill = skill !== undefined ? skill : new Map();
		this.item = item !== undefined ? item : new Map();
	}

	public static from({ attribute, skill, item }: CharacterParamsData): CharacterParams {
		return new CharacterParams({
			attribute: validate("attribute", attribute).optional(v => v.dict(v => v.dict(v => v.any()))).value,
			skill: validate("skill", skill).optional(v => v.dict(v => v.number())).value,
			item: validate("item", item).optional(v => v.dict(v => v.int())).value,
		});
	}

	public toJSON(): CharacterParamsData {
		return {
			attribute: toObject(this.attribute, toObject),
			skill: toObject(this.skill),
			item: toObject(this.item),
		};
	}

	public set(config: Partial<CharacterParamsConfig>): CharacterParams {
		const { attribute, skill, item } = this;

		return new CharacterParams({ attribute, skill, item, ...config });
	}
}

export interface AttributeParams extends ReadonlyMap<string, InputParams> { }

export interface InputParams extends ReadonlyMap<string, any> { }

export interface SkillParams extends ReadonlyMap<string, number> { }

export interface ItemParams extends ReadonlyMap<string, number> { }

function toObject<T, U = T>(source: ReadonlyMap<string, T>, map?: (value: T) => U): { [key: string]: U } {
	const o = Object.create(null);
	source.forEach((v, k) => o[k] = (map !== undefined ? map(v) : v));
	return o;
}