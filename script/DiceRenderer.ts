namespace Cthulhu {
	export class DiceRenderer {

		public static readonly DATA_DICE_CLASS = "diceClass";
		public static readonly DATA_DICE_VALUE = "diceValue";

		public static readonly CLASS_DICE_6 = "dice6";
		public static readonly CLASS_DICE_10 = "dice10";
		public static readonly CLASS_DICE_100 = "dice100";

		private groups: DiceGroup[];
		private map: Map<Dice, HTMLElement>;

		public constructor(readonly container: HTMLElement) {
			this.clear();
		}

		public clear(): void {
			this.groups = [];
			this.map = new Map<Dice, HTMLElement>();

			DiceRenderer.clearChild(this.container);
		}

		public makeDices(diceSet: DiceSet): void {
			this.clear();

			const diceClass = this.container.dataset[DiceRenderer.DATA_DICE_CLASS];
			if (diceClass != null) {
				const factory = DiceRenderer.getDiceGroupFactory(diceSet);
				for (let i = 0; i < diceSet.count; i++) {
					const group = factory();
					for (const dice of group.dices) {
						const typeClass = DiceRenderer.getDiceTypeClass(dice.type);
						const element = this.createDice(diceClass, typeClass);

						this.map.set(dice, element);
					}

					this.groups.push(group);
				}

				this.refresh();
			}
		}

		public setValues(values: number[]): void {
			for (let i = 0; i < values.length; i++) {
				const group = this.groups[i];
				if (group != null) {
					group.setValue(values[i]);
				}
			}

			this.refresh();
		}

		public refresh(): void {
			for (const group of this.groups) {
				for (const dice of group.dices) {
					const element = this.map.get(dice);
					const data = String(dice.value);
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

		private static getDiceGroupFactory(diceSet: DiceSet): DiceGroupFactory {
			const max = diceSet.max;
			if (max > 100) return () => new DigitDiceGroup(diceSet.max);
			if (max > 10) return () => new D100D10DiceGroup();
			if (max > 6) return () => new D10DiceGroup();
			return () => new D6DiceGroup();
		}

		private static getDiceTypeClass(type: number): string {
			switch (type) {
				case 6: return this.CLASS_DICE_6;
				case 10: return this.CLASS_DICE_10;
				case 100: return this.CLASS_DICE_100;
			}

			throw new Error("Invalid dice type.");
		}

		private static clearChild(element: HTMLElement): void {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
		}
	}

	type DiceGroupFactory = () => DiceGroup;

	class Dice {
		public value: number;

		public constructor(readonly type: number) {
			this.value = 0;
		}
	}

	interface DiceGroup {
		readonly dices: ReadonlyArray<Dice>;
		setValue(value: number): void;
	}

	class DigitDiceGroup implements DiceGroup {
		public readonly dices: Dice[] = [];

		public constructor(max: number) {
			for (let x = max; x > 0; x = Math.floor(x / 10)) {
				this.dices.push(new Dice(10));
			}
			this.setValue(max);
		}

		public setValue(value: number): void {
			for (let i = 0; i < this.dices.length; i++) {
				const n = value % 10;
				this.dices[this.dices.length - 1 - i].value = n;
				value -= n;
			}
		}
	}

	class D100D10DiceGroup implements DiceGroup {
		public readonly dices: Dice[] = [];

		public constructor() {
			this.dices.push(new Dice(100));
			this.dices.push(new Dice(10));
			this.setValue(100);
		}

		public setValue(value: number): void {
			const rem = value % 10;
			this.dices[0].value = (value - rem) % 100;
			this.dices[1].value = rem;
		}
	}

	class D10DiceGroup implements DiceGroup {
		public readonly dices: Dice[] = [];

		public constructor() {
			this.dices.push(new Dice(10));
			this.setValue(10);
		}

		public setValue(value: number): void {
			this.dices[0].value = value % 10;
		}
	}

	class D6DiceGroup implements DiceGroup {
		public readonly dices: Dice[] = [];

		public constructor() {
			this.dices.push(new Dice(6));
			this.setValue(1);
		}

		public setValue(value: number): void {
			this.dices[0].value = value;
		}
	}
}