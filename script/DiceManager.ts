namespace Cthulhu {
	export class DiceSet {
		private static readonly DICE_REGEX = /[1-9]\d*D[1-9]\d*/.compile();

		public constructor(readonly count: number, readonly max: number) { }

		public static create(expression: string): DiceSet {
			if (!this.DICE_REGEX.test(expression)) throw new Error("Invalid expression.");

			const [first, second] = expression.split("D");
			const count = parseInt(first, 10);
			const max = parseInt(second, 10);

			return new DiceSet(count, max);
		}
	}

	export interface DiceListener {
		onStart?(): void;
		onStop?(results: number[]): void;
		onUpdate?(values: number[]): void;
		onSelectionChanged?(id: string, diceSet: DiceSet): void;
	}

	export class DiceManager {
		private constructor() { }

		public static interval: number = 100;
		public static duration: number = 1000;

		private static current: string | null = null;
		private static rolling: boolean = false;

		private static diceSets: Map<string, DiceSet> = new Map<string, DiceSet>();
		private static listeners: DiceListener[] = [];

		public static get selection(): string | null { return this.current; }

		public static register(id: string, diceSet: DiceSet): void {
			this.diceSets.set(id, diceSet);
		}

		public static unregister(id: string): void {
			this.diceSets.delete(id);
		}

		public static addListener(listener: DiceListener): void {
			const index = this.listeners.indexOf(listener);
			if (index < 0) this.listeners.push(listener);
		}

		public static removeListener(listener: DiceListener): void {
			const index = this.listeners.indexOf(listener);
			if (index >= 0) this.listeners.splice(index, 1);
		}

		public static select(id: string): boolean {
			if (id !== this.current && !this.rolling) {
				const diceSet = this.diceSets.get(id);
				if (diceSet != null) {
					this.current = id;

					this.raiseEvent("onSelectionChanged", id, diceSet);

					return true;
				}
			}

			return false;
		}

		public static roll(): boolean {
			if (this.current != null && !this.rolling) {
				const diceSet = this.diceSets.get(this.current);
				if (diceSet != null) {
					this.rollAsync(diceSet)

					return true;
				}
			}

			return false;
		}

		private static async rollAsync(diceSet: DiceSet): Promise<void> {
			this.rolling = true;
			this.raiseEvent("onStart");

			const endTime = Date.now() + this.duration;
			while (Date.now() < endTime) {
				await new Promise(resolve => setTimeout(resolve, this.interval));

				if (this.current != null) {
					const values = this.randomValues(diceSet);
					this.raiseEvent("onUpdate", values);
				}
			}

			const results = this.randomValues(diceSet);
			this.raiseEvent("onStop", results);
			this.rolling = false;
		}

		private static randomValues(diceSet: DiceSet): number[] {
			const results = [];
			for (let i = 0; i < diceSet.count; i++) {
				results.push(Math.floor(Math.random() * diceSet.max) + 1);
			}

			return results;
		}

		private static raiseEvent(event: keyof DiceListener, ...args: any[]): void {
			for (const listener of this.listeners) {
				const handler = listener[event];
				if (handler != null) handler.apply(listener, args);
			}
		}
	}
}