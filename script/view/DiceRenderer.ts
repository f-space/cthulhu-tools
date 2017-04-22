namespace Cthulhu {
	export class DiceRenderer {

		public static readonly DATA_DICE_CLASS = "diceClass";
		public static readonly DATA_DICE_VALUE = "diceValue";

		public static readonly CLASS_DICE_6 = "dice6";
		public static readonly CLASS_DICE_10 = "dice10";
		public static readonly CLASS_DICE_100 = "dice100";

		private _map: Map<Dice, HTMLElement>;

		public constructor(readonly container: HTMLElement) {
			this.clear();
		}

		public clear(): void {
			this._map = new Map<Dice, HTMLElement>();

			DiceRenderer.clearChild(this.container);
		}

		public makeDices(diceSet: DiceSet): void {
			this.clear();

			const diceClass = this.container.dataset[DiceRenderer.DATA_DICE_CLASS];
			if (diceClass != null) {
				for (const group of diceSet.groups) {
					for (const dice of group.dices) {
						const typeClass = DiceRenderer.getDiceTypeClass(dice.type);
						const element = this.createDice(diceClass, typeClass);

						this._map.set(dice, element);
					}
				}

				this.refresh(diceSet);
			}
		}

		public setValues(diceSet: DiceSet, values: number[]): void {
			for (let i = 0; i < values.length; i++) {
				const group = diceSet.groups[i];
				if (group != null) {
					group.value = values[i];
				}
			}

			this.refresh(diceSet);
		}

		public refresh(diceSet: DiceSet): void {
			for (const group of diceSet.groups) {
				for (const dice of group.dices) {
					const element = this._map.get(dice);
					const data = String(dice.face);
					if (element != null) {
						element.dataset[DiceRenderer.DATA_DICE_VALUE] = data;
					}
				}
			}
		}

		private createDice(diceClass: string, typeClass: string): HTMLElement {
			const dice = document.createElement("div");
			dice.classList.add(diceClass);
			dice.classList.add(typeClass);
			this.container.appendChild(dice);

			return dice;
		}

		private static getDiceTypeClass(type: DiceType): string {
			switch (type) {
				case DiceType.D6: return this.CLASS_DICE_6;
				case DiceType.D10: return this.CLASS_DICE_10;
				case DiceType.D100: return this.CLASS_DICE_100;
			}

			throw new Error("Invalid dice type.");
		}

		private static clearChild(element: HTMLElement): void {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
		}
	}
}