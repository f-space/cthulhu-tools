import { ProfileManager } from "model/profile";
import { AttributeManager } from "model/attribute";
import { SkillManager } from "model/skill";
import { CharacterManager } from "model/character";
import { StatusManager } from "model/status";
import { PageManager } from "view/page";
import DiceImage from "view/dice-image";

export const status = new StatusManager(
	new ProfileManager(),
	new AttributeManager(),
	new SkillManager(),
	new CharacterManager(),
);

export const navigation = new PageManager('home');

class Resources {
	private _diceImage: DiceImage | undefined;
	private _diceSound: HTMLAudioElement | undefined;

	public get diceImage(): DiceImage { return (this._diceImage || (this._diceImage = this.getDiceImage())); }
	public get diceSound(): HTMLAudioElement { return (this._diceSound || (this._diceSound = this.getDiceSound())); }

	private getDiceImage(): DiceImage {
		return new DiceImage(document.getElementById("dice-image") as HTMLImageElement);
	}

	private getDiceSound(): HTMLAudioElement {
		return document.getElementById("dice-sound") as HTMLAudioElement;
	}
}

export const resources = new Resources();