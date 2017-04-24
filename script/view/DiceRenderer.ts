/// <reference path="../model/__index__.ts"/>
/// <reference path="DiceImage.ts"/>

namespace Cthulhu {
	export class DiceRenderer implements DiceListener {

		public static readonly DATA_DICE_CLASS = "diceClass";

		private _map: Map<Dice, HTMLCanvasElement> = new Map();

		public constructor(readonly container: HTMLElement, readonly image: DiceImage) { }

		public clear(): void {
			this._map.clear();

			DiceRenderer.clearChild(this.container);
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
			const diceClass = this.container.dataset[DiceRenderer.DATA_DICE_CLASS];
			for (const group of diceSet.groups) {
				for (const dice of group.dices) {
					const element = this.createDice(diceClass);

					this._map.set(dice, element);
				}
			}
		}

		private refresh(diceSet: DiceSet): void {
			for (const group of diceSet.groups) {
				for (const dice of group.dices) {
					const element = this._map.get(dice);
					if (element != null) {
						this.image.blit(element, dice.type, dice.face);
					}
				}
			}
		}

		private createDice(diceClass?: string): HTMLCanvasElement {
			const dice = document.createElement('canvas');
			if (diceClass != null) dice.classList.add(diceClass);
			this.container.appendChild(dice);

			return dice;
		}

		private static clearChild(element: HTMLElement): void {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
		}
	}
}