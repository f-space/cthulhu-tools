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

		const modes = Array.from(<NodeListOf<HTMLElement>>document.querySelectorAll("#dice>.contents>.mode-list>.mode"));
		for (const mode of modes) {
			const id = mode.dataset["dice"];
			if (id != null) {
				if (id === 'custom') {
					mode.addEventListener("click", () => { openCustomDiceDialog(); });
				} else {
					manager.register(id, DiceSet.parse(id));
					mode.addEventListener("click", () => { manager.select(id); });
				}
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
		const rollButton = document.querySelector("#dice>.contents>.roll-button");
		if (rollButton instanceof HTMLButtonElement) {
			rollButton.addEventListener("click", () => { manager.roll() });
		}
	}

	function initRollSound(): void {
		const rollSound = document.querySelector("#dice-sound");
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
		const diceView = document.querySelector("#dice>.contents>.result>.dice-view");
		const diceImage = document.getElementById("dice-image");
		if (diceView instanceof HTMLElement && diceImage instanceof HTMLImageElement) {
			const renderer = new DiceRenderer(diceView, new DiceImage(diceImage));

			manager.addListener(renderer);
		}
	}

	function initNumberView(): void {
		const numberView = document.querySelector("#dice>.contents>.result>.number-view");
		if (numberView instanceof HTMLElement) {
			const renderer = new DiceNumberRenderer(numberView);

			manager.addListener(renderer);
		}
	}

	function initCustomDiceDialog(): void {
		const cancelButton = document.querySelector("#dice>.overlay>.custom-dice-dialog .cancel");
		const okButton = document.querySelector("#dice>.overlay>.custom-dice-dialog .ok");
		if (cancelButton instanceof HTMLButtonElement) {
			cancelButton.addEventListener("click", () => { closeCustomDiceDialog(true); });
		}
		if (okButton instanceof HTMLButtonElement) {
			okButton.addEventListener("click", () => { closeCustomDiceDialog(false); });
		}
	}

	function openCustomDiceDialog(): void {
		const dialog = document.querySelector("#dice>.overlay>.custom-dice-dialog");
		if (dialog instanceof HTMLElement) {
			dialog.classList.remove('hidden');
		}

		updateOverlay();
	}

	function closeCustomDiceDialog(cancel: boolean): void {
		const dialog = document.querySelector("#dice>.overlay>.custom-dice-dialog");
		if (dialog instanceof HTMLElement) {
			dialog.classList.add('hidden');

			if (!cancel) {
				const countInput = document.querySelector("#dice>.overlay>.custom-dice-dialog .count");
				const maxInput = document.querySelector("#dice>.overlay>.custom-dice-dialog .max");
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
		}

		updateOverlay();
	}

	function updateOverlay(): void {
		const contents = document.querySelector("#dice>.contents");
		const overlay = document.querySelector("#dice>.overlay");
		if (contents instanceof HTMLElement && overlay instanceof HTMLElement) {
			const children = Array.from(overlay.children);
			if (children.some(dialog => !dialog.classList.contains('hidden'))) {
				contents.classList.add('disabled');
				overlay.classList.remove('disabled');
			} else {
				contents.classList.remove('disabled');
				overlay.classList.add('disabled');
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