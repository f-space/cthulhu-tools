import { validate } from "./validation";

export interface CharacterViewData {
	readonly target: string;
	readonly visible?: boolean;
}

export interface CharacterViewConfig {
	readonly target: string;
	readonly visible?: boolean;
}

export class CharacterView {
	public readonly target: string;
	public readonly visible: boolean;

	public constructor({ target, visible }: CharacterViewConfig) {
		this.target = target;
		this.visible = Boolean(visible);
	}

	public static from({ target, visible }: CharacterViewData) {
		return new CharacterView({
			target: validate("target", target).string().uuid().value,
			visible: validate("visible", visible).optional(v => v.bool()).value,
		});
	}

	public toJSON(): CharacterViewData {
		return {
			target: this.target,
			visible: this.visible || undefined,
		}
	}

	public set(config: Partial<CharacterViewConfig>): CharacterView {
		const { target, visible } = this;

		return new CharacterView({ target, visible, ...config });
	}
}