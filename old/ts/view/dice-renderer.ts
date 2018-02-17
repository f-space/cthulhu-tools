import { Dice, DiceSet } from "model/dice";
import { DiceManager, DiceListener, DiceRollEventType } from "model/dice-roll";
import DiceImage from "./dice-image";

export default class DiceRenderer implements DiceListener {

	private _map: Map<Dice, HTMLCanvasElement> = new Map();

	public constructor(readonly view: HTMLElement, readonly image: DiceImage, readonly group?: string, readonly dice?: string) { }

	public clear(): void {
		this._map.clear();

		DiceRenderer.clearChildren(this.view);
	}

	public onAttached(manager: DiceManager): void {
		this.initDices(manager);
	}

	public onDetached(manager: DiceManager): void {
		this.clear();
	}

	public onRoll(manager: DiceManager, type: DiceRollEventType): void {
		if (type === DiceRollEventType.Update) {
			const diceSet = manager.diceSet;
			if (diceSet) {
				this.refresh(diceSet);
			}
		}
	}

	public onDiceSetChanged(manager: DiceManager): void {
		this.initDices(manager);
	}

	private initDices(manager: DiceManager): void {
		this.clear();

		const diceSet = manager.diceSet;
		if (diceSet) {
			this.makeDices(diceSet);
			this.refresh(diceSet);
		}
	}

	private makeDices(diceSet: DiceSet): void {
		for (const group of diceSet) {
			const groupElement = DiceRenderer.createElement(this.view, 'div', this.group);
			for (const dice of group) {
				const diceElement = DiceRenderer.createElement(groupElement, 'canvas', this.dice);

				this._map.set(dice, diceElement);
			}
		}
	}

	private refresh(diceSet: DiceSet): void {
		for (const group of diceSet) {
			for (const dice of group) {
				const element = this._map.get(dice);
				if (element != null) {
					this.image.blit(element, dice.type, dice.face);
				}
			}
		}
	}

	private static createElement<K extends keyof HTMLElementTagNameMap>(parent: Node, tag: K, clazz?: string): HTMLElementTagNameMap[K] {
		const element = document.createElement(tag);
		if (clazz) element.classList.add(clazz);
		return parent.appendChild(element);
	}

	private static clearChildren(element: HTMLElement): void {
		while (element.lastChild) element.removeChild(element.lastChild);
	}
}