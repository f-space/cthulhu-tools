import * as validation from "./validation";

export interface CharacterViewData {
	readonly target: string;
	readonly visible?: boolean;
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