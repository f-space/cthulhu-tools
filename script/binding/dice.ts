/// <reference path="../model/__index__.ts"/>
/// <reference path="../view/__index__.ts"/>

namespace Cthulhu {
	const SELETED_CLASS = "selected";
	const manager = new DiceManager();

	function initDiceSet(): void {
		const callbacks = <Function[]>[];
		manager.addListener(new class {
			public onDiceSetChanged(): void {
				for (const callback of callbacks) callback();
			}
		}());

		const modes = document.querySelectorAll("#dice>.mode-list>.mode");
		for (const mode of <NodeListOf<HTMLElement>>modes) {
			const id = mode.dataset["dice"];
			if (id != null) {
				manager.register(id, DiceSet.parse(id));
				mode.addEventListener("click", () => { manager.select(id); });
				callbacks.push(() => {
					if (manager.current === id) {
						mode.classList.add(SELETED_CLASS);
					} else {
						mode.classList.remove(SELETED_CLASS);
					}
				});
			}
		}
	}

	function initRollButton(): void {
		const rollButton = document.querySelector("#dice>.roll-button");
		if (rollButton instanceof HTMLButtonElement) {
			rollButton.addEventListener("click", () => { manager.roll() });
		}
	}

	function initRollSound(): void {
		const rollSound = document.querySelector("#dice>audio");
		if (rollSound instanceof HTMLAudioElement) {
			manager.addListener(new class {
				public onRoll(manager: DiceManager, type: DiceRollEventType) {
					if (type === DiceRollEventType.Start) {
						rollSound.pause();
						rollSound.currentTime = 0;
						rollSound.play();
					}
				}
			}());
		}
	}

	function initDiceView(): void {
		const diceView = document.querySelector("#dice>.result>.dice-view");
		const diceImage = document.getElementById("dice-image");
		if (diceView instanceof HTMLElement && diceImage instanceof HTMLImageElement) {
			const renderer = new DiceRenderer(diceView, new DiceImage(diceImage));

			manager.addListener(renderer);
		}
	}

	function initNumberView(): void {
		const numberView = document.querySelector("#dice>.result>.number-view");
		if (numberView instanceof HTMLElement) {
			manager.addListener(new class {
				public onRoll(manager: DiceManager, type: DiceRollEventType): void {
					if (type === DiceRollEventType.Update) {
						const diceSet = manager.diceSet;
						if (diceSet) {
							const value = diceSet.groups.reduce((sum, group) => sum + group.value, 0);

							numberView.textContent = value.toString(10);
						}
					}
				}

				public onDiceSetChanged(): void {
					numberView.textContent = null;
				}
			});
		}
	}

	ViewManager.register(() => {
		initDiceSet();
		initRollButton();
		initRollSound();
		initDiceView();
		initNumberView();
	})
}