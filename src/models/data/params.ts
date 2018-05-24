export interface CharacterParams {
	readonly attribute: AttributeParams;
	readonly skill: SkillParams;
	readonly item: ItemParams;
}

export interface AttributeParams {
	readonly [id: string]: InputParams
}

export interface InputParams {
	readonly [name: string]: any;
}

export interface SkillParams {
	readonly [id: string]: number;
}

export interface ItemParams {
	readonly [uuid: string]: number;
}