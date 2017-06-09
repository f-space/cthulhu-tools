import { DiceSet } from "model/dice";
import { DiceManager, DiceListener, DiceRollEventType } from "model/dice-roll";

enum Result {
	Normal,
	Critical,
	Fumble,
}

export default class DiceNumberRenderer implements DiceListener {

	public static readonly DATA_CRITICAL_CLASS = "criticalClass";
	public static readonly DATA_FUMBLE_CLASS = "fumbleClass";

	public constructor(readonly view: HTMLElement) { }

	public clear(): void {
		this.view.textContent = null;
	}

	public onAttached(manager: DiceManager): void {
		this.update(manager);
	}

	public onDetached(manager: DiceManager): void {
		this.clear();
	}

	public onRoll(manager: DiceManager, type: DiceRollEventType): void {
		if (type === DiceRollEventType.Update) {
			this.update(manager);
		}
	}

	public onDiceSetChanged(manager: DiceManager): void {
		this.update(manager);
	}

	private update(manager: DiceManager): void {
		const diceSet = manager.diceSet;
		if (diceSet) {
			this.view.textContent = diceSet.total.toString(10);
			this.updateClass(diceSet);
		}
	}

	private updateClass(diceSet: DiceSet): void {
		const critical = this.view.dataset[DiceNumberRenderer.DATA_CRITICAL_CLASS];
		const fumble = this.view.dataset[DiceNumberRenderer.DATA_FUMBLE_CLASS];
		const classList = this.view.classList;

		const result = this.getResult(diceSet);
		if (critical) {
			if (result === Result.Critical) {
				classList.add(critical);
			} else {
				classList.remove(critical);
			}
		}
		if (fumble) {
			if (result === Result.Fumble) {
				classList.add(fumble);
			} else {
				classList.remove(fumble);
			}
		}
	}

	private getResult(diceSet: DiceSet): Result {
		if (diceSet.size === 1 && diceSet.max === 100) {
			const value = diceSet.total;
			if (value <= 5) return Result.Critical;
			if (value > 95) return Result.Fumble;
		}
		return Result.Normal;
	}
}