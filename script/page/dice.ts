/// <reference path="../model/__index__.ts"/>
/// <reference path="../view/__index__.ts"/>

namespace Cthulhu {
	const manager = new DiceManager();

	function initDiceSet(): void {
		const elements = <HTMLElement[]>Array.from(document.querySelectorAll("#dice .mode-list .mode"));
		const modes = elements.map<[HTMLElement, string]>(element => [element, element.dataset['dice'] || 'custom']);
		for (const [mode, id] of modes) {
			if (id === 'custom') {
				mode.addEventListener("click", () => { openCustomDiceDialog(); });
			} else {
				mode.addEventListener("click", () => { manager.select(id); });
				manager.register(id, DiceSet.parse(id));
			}
		}

		manager.addListener(new class {
			public onDiceSetChanged(): void {
				for (const [mode, id] of modes) {
					if (manager.current === id) {
						mode.classList.add('selected');
					} else {
						mode.classList.remove('selected');
					}
				}
			}
		});
	}

	function initRollButton(): void {
		const rollButton = document.querySelector("#dice .roll-button");
		if (rollButton instanceof HTMLButtonElement) {
			rollButton.addEventListener("click", () => { manager.roll() });
		}
	}

	function initRollSound(): void {
		const rollSound = document.getElementById("dice-sound");
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
		const diceView = document.querySelector("#dice .result .dice-view");
		const diceImage = document.getElementById("dice-image");
		if (diceView instanceof HTMLElement && diceImage instanceof HTMLImageElement) {
			const renderer = new DiceRenderer(diceView, new DiceImage(diceImage));

			manager.addListener(renderer);
		}
	}

	function initNumberView(): void {
		const numberView = document.querySelector("#dice .result .number-view");
		if (numberView instanceof HTMLElement) {
			const renderer = new DiceNumberRenderer(numberView);

			manager.addListener(renderer);
		}
	}

	function initCustomDiceDialog(): void {
		const cancelButton = document.querySelector("#custom-dice-dialog .cancel");
		const okButton = document.querySelector("#custom-dice-dialog .ok");
		if (cancelButton instanceof HTMLButtonElement) {
			cancelButton.addEventListener("click", () => { closeCustomDiceDialog(true); });
		}
		if (okButton instanceof HTMLButtonElement) {
			okButton.addEventListener("click", () => { closeCustomDiceDialog(false); });
		}
	}

	function openCustomDiceDialog(): void {
		const dialog = document.getElementById("custom-dice-dialog");
		if (dialog instanceof HTMLElement) {
			dialog.classList.add('open');
		}

		updateOverlay();
	}

	function closeCustomDiceDialog(cancel: boolean): void {
		const dialog = document.getElementById("custom-dice-dialog");
		if (dialog instanceof HTMLElement) {
			dialog.classList.remove('open');

			if (!cancel) {
				registerCustomDice();
			}
		}

		updateOverlay();
	}

	function registerCustomDice(): void {
		const countInput = document.querySelector("#custom-dice-dialog .count");
		const maxInput = document.querySelector("#custom-dice-dialog .max");
		if (countInput instanceof HTMLInputElement && maxInput instanceof HTMLInputElement) {
			if (countInput.validity.valid && maxInput.validity.valid) {
				const id = 'custom';
				const count = parseInt(countInput.value, 10);
				const max = parseInt(maxInput.value, 10);
				const diceSet = DiceSet.create(count, max);

				manager.register(id, diceSet);
				manager.select(id);
			}
		}
	}

	function updateOverlay(): void {
		const dice = document.getElementById("dice");
		if (dice instanceof HTMLElement) {
			const dialogs = <HTMLElement[]>Array.from(document.querySelectorAll("#dice .dialog"));
			if (dialogs.some(dialog => dialog.classList.contains('open'))) {
				dice.classList.add('overlaid');
			} else {
				dice.classList.remove('overlaid');
			}
		}
	}

	ViewManager.register(() => {
		initDiceSet();
		initRollButton();
		initRollSound();
		initDiceView();
		initNumberView();
		initCustomDiceDialog();
	})
}