import { DiceSet, DiceGroup } from "./dice";

type DiceSetMap = { [id: string]: DiceSet | undefined };

export enum DiceRollEventType {
	Start,
	Stop,
	Update,
}

export interface DiceListener {
	onAttached?(manager: DiceManager): void;
	onDetached?(manager: DiceManager): void;
	onRoll?(manager: DiceManager, type: DiceRollEventType): void;
	onDiceSetChanged?(manager: DiceManager): void;
}

export class DiceManager {
	public interval: number = 100;
	public duration: number = 1000;

	private _current: string | null = null;
	private _diceSets: DiceSetMap = Object.create(null);
	private _listeners: DiceListener[] = [];
	private _rolling: boolean = false;

	public get current(): string | null { return this._current; }
	public get diceSet(): DiceSet | null | undefined { return (this._current !== null ? this._diceSets[this._current] : null); }

	public register(id: string, diceSet: DiceSet): void {
		this._diceSets[id] = diceSet;

		if (this._current === id) {
			this.raiseDiceSetChangedEvent();
		}
	}

	public unregister(id: string): void {
		delete this._diceSets[id];

		if (this._current === id) {
			this._current = null;
			this.raiseDiceSetChangedEvent();
		}
	}

	public list(): string[] {
		return Object.keys(this._diceSets);
	}

	public get(id: string): DiceSet | undefined {
		return this._diceSets[id];
	}

	public addListener(listener: DiceListener): void {
		const index = this._listeners.indexOf(listener);
		if (index === -1) {
			this._listeners.push(listener);

			if (listener.onAttached) listener.onAttached(this);
		}
	}

	public removeListener(listener: DiceListener): void {
		const index = this._listeners.indexOf(listener);
		if (index !== -1) {
			this._listeners.splice(index, 1);

			if (listener.onDetached) listener.onDetached(this);
		}
	}

	public select(id: string | null): void {
		if (!this._rolling && id !== this._current) {
			if (id === null || id in this._diceSets) {
				this._current = id;

				this.raiseDiceSetChangedEvent();
			} else {
				throw new Error(`Unknown DiceSet: ${id}.`);
			}
		}
	}

	public roll(): void {
		const id = this._current;
		if (!this._rolling && id !== null) {
			const diceSet = this._diceSets[id];
			if (diceSet) {
				this._rolling = true;
				this.rollAsync(diceSet).then(() => {
					this._rolling = false;
				}, (e: any) => {
					this._rolling = false;
					console.error(e);
				});
			}
		}
	}

	private async rollAsync(diceSet: DiceSet): Promise<void> {
		this.raiseRollEvent(DiceRollEventType.Start);

		const endTime = Date.now() + this.duration;
		while (Date.now() < endTime) {
			this.updateDiceFaces(diceSet);
			this.raiseRollEvent(DiceRollEventType.Update);

			await DiceManager.sleep(this.interval);
		}

		this.updateDiceFaces(diceSet);
		this.raiseRollEvent(DiceRollEventType.Update);

		this.raiseRollEvent(DiceRollEventType.Stop);
	}

	private updateDiceFaces(diceSet: DiceSet): void {
		for (const group of diceSet.groups) {
			group.value = DiceManager.random(group);
		}
	}

	private raiseRollEvent(type: DiceRollEventType): void {
		for (const listener of this._listeners) {
			if (listener.onRoll) listener.onRoll(this, type);
		}
	}

	private raiseDiceSetChangedEvent(): void {
		for (const listener of this._listeners) {
			if (listener.onDiceSetChanged) listener.onDiceSetChanged(this);
		}
	}

	private static random(group: DiceGroup): number {
		return Math.floor(Math.random() * group.max) + 1;
	}

	private static async sleep(duration: number): Promise<void> {
		await new Promise(resolve => setTimeout(resolve, duration));
	}
}