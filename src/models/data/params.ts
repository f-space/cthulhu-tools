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
		this.attribute = attribute !== undefined ? attribute : new AttributeParams();
		this.skill = skill !== undefined ? skill : new SkillParams();
		this.item = item !== undefined ? item : new ItemParams();
	}

	public static from({ attribute, skill, item }: CharacterParamsData): CharacterParams {
		return new CharacterParams({
			attribute: validate("attribute", attribute).optional(v => v.object<AttributeParamsData>().map(AttributeParams.from)).value,
			skill: validate("skill", skill).optional(v => v.object<SkillParamsData>().map(SkillParams.from)).value,
			item: validate("item", item).optional(v => v.object<ItemParamsData>().map(ItemParams.from)).value,
		});
	}

	public toJSON(): CharacterParamsData {
		return {
			attribute: this.attribute.toJSON(),
			skill: this.skill.toJSON(),
			item: this.item.toJSON(),
		};
	}

	public set(config: Partial<CharacterParamsConfig>): CharacterParams {
		const { attribute, skill, item } = this;

		return new CharacterParams({ attribute, skill, item, ...config });
	}
}

export class AttributeParams {
	public readonly inputs: ReadonlyMap<string, InputParams>;

	public constructor(inputs?: ReadonlyMap<string, InputParams>) {
		this.inputs = inputs !== undefined ? inputs : new Map();
	}

	public static from(data: AttributeParamsData): AttributeParams {
		return new AttributeParams(validate("data", data).dict(v => v.or({}).map(InputParams.from)).value);
	}

	public toJSON(): AttributeParamsData {
		return toObject(this.inputs, input => input.toJSON());
	}

	public get(id: string): InputParams | undefined {
		return this.inputs.get(id);
	}
}

export class InputParams {
	public readonly data: ReadonlyMap<string, any>;

	public constructor(data?: ReadonlyMap<string, any>) {
		this.data = data !== undefined ? data : new Map();
	}

	public static from(data: InputParamsData): InputParams {
		return new InputParams(validate("data", data).dict(v => v.any()).value);
	}

	public toJSON(): InputParamsData {
		return toObject(this.data);
	}

	public get(name: string): any {
		return this.data.get(name);
	}
}

export class SkillParams {
	public readonly data: ReadonlyMap<string, number>;

	public constructor(data?: ReadonlyMap<string, number>) {
		this.data = data !== undefined ? data : new Map();
	}

	public static from(data: SkillParamsData): SkillParams {
		return new SkillParams(validate("data", data).dict(v => v.number()).value);
	}

	public toJSON(): SkillParamsData {
		return toObject(this.data);
	}

	public get(id: string): number | undefined {
		return this.data.get(id);
	}
}

export class ItemParams {
	public readonly data: ReadonlyMap<string, number>;

	public constructor(data?: ReadonlyMap<string, number>) {
		this.data = data !== undefined ? data : new Map();
	}

	public static from(data: ItemParamsData): ItemParams {
		return new ItemParams(validate("data", data).dict(v => v.int()).value);
	}

	public toJSON(): ItemParamsData {
		return toObject(this.data);
	}

	public get(uuid: string): number | undefined {
		return this.data.get(uuid);
	}
}

function toObject<T, U = T>(source: ReadonlyMap<string, T>, map?: (value: T) => U): { [key: string]: U } {
	const o = Object.create(null);
	source.forEach((v, k) => o[k] = (map !== undefined ? map(v) : v));
	return o;
}