import * as validation from "./validation";

export interface CharacterViewData {
	readonly target: string;
	readonly visible?: boolean;
}

export interface CharacterData {
	readonly uuid?: string;
	readonly profile: string;
	readonly history?: string | null;
	readonly params?: Partial<CharacterParams>;
}

export class CharacterView {
	public readonly target: string;
	public readonly visible: boolean;

	public constructor({ target, visible }: CharacterViewData) {
		this.target = validation.string(target);
		this.visible = validation.boolean(validation.or(visible, true));
	}

	public toJSON(): CharacterViewData {
		return {
			target: this.target,
			visible: this.visible && undefined,
		}
	}
}

export class Character {
	public readonly uuid: string;
	public readonly profile: string;
	public readonly history: string | null;
	public readonly params: CharacterParams;
	public readonly readonly: boolean;

	public constructor({ uuid, profile, history, params }: CharacterData, readonly?: boolean) {
		this.uuid = validation.uuid(uuid);
		this.profile = validation.string(profile);
		this.history = validation.string_null(history);
		this.params = validation.props(params, {
			attribute: validation.plainObject,
			skill: validation.plainObject,
			item: validation.plainObject,
		});
		this.readonly = Boolean(readonly);
	}

	public toJSON(): CharacterData {
		return {
			uuid: this.uuid,
			profile: this.profile,
			history: this.history,
			params: this.params,
		};
	}
}

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