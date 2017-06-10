import { DiceSet } from "model/dice";
import { DiceManager, DiceListener, DiceRollEventType } from "model/dice-roll";

enum Result {
	Normal,
	Critical,
	Fumble,
}

export default class DiceNumberRenderer implements DiceListener {

	public constructor(readonly view: HTMLElement, readonly critical?: string, readonly fumble?: string) { }

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
		const result = this.getResult(diceSet);
		this.setClass(this.critical, result === Result.Critical);
		this.setClass(this.fumble, result === Result.Fumble);
	}

	private getResult(diceSet: DiceSet): Result {
		if (diceSet.size === 1 && diceSet.max === 100) {
			const value = diceSet.total;
			if (value <= 5) return Result.Critical;
			if (value > 95) return Result.Fumble;
		}
		return Result.Normal;
	}

	private setClass(clazz: string | undefined, condition: boolean): void {
		if (clazz) {
			if (condition) {
				this.view.classList.add(clazz);
			} else {
				this.view.classList.remove(clazz);
			}
		}
	}
}