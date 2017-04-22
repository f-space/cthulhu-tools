namespace Cthulhu {
	document.addEventListener("DOMContentLoaded", function () {
		const modes = <HTMLElement[]>Array.from(document.querySelectorAll("#dice>.mode-list>.mode"));
		for (const mode of modes) {
			const diceExpr = mode.dataset["dice"];
			if (diceExpr != null) {
				const diceSet = DiceSet.parse(diceExpr);

				DiceManager.register(diceExpr, diceSet);
				mode.addEventListener("click", () => { DiceManager.select(diceExpr); });
			}
		}

		const rollButton = document.querySelector("#dice>.roll-button");
		const rollSound = document.querySelector("#dice>audio");
		if (rollButton instanceof HTMLButtonElement && rollSound instanceof HTMLAudioElement) {
			rollButton.addEventListener("click", () => {
				if (DiceManager.roll()) {
					rollSound.pause();
					rollSound.currentTime = 0;
					rollSound.play();
				}
			});
		}

		DiceManager.addListener(new class {
			public onSelectionChanged(id: string, diceSet: DiceSet): void {
				for (const mode of modes) {
					if (mode.dataset["dice"] === id) {
						mode.classList.add("selected");
					} else {
						mode.classList.remove("selected");
					}
				}
			}
		});

		const diceView = document.querySelector("#dice>.result>.dice-view");
		if (diceView instanceof HTMLElement) {
			const renderer = new DiceRenderer(diceView);
			DiceManager.addListener(new class {
				public onSelectionChanged(id: string, diceSet: DiceSet): void {
					renderer.makeDices(diceSet);
				}

				public onStart(): void { }

				public onUpdate(diceSet: DiceSet, values: number[]): void {
					renderer.setValues(diceSet, values);
				}

				public onStop(diceSet: DiceSet, results: number[]): void {
					renderer.setValues(diceSet, results);
				}
			});
		}

		const numberView = document.querySelector("#dice>.result>.number-view");
		if (numberView instanceof HTMLElement) {
			DiceManager.addListener(new class {
				public onSelectionChanged(id: string, diceSet: DiceSet): void {
					numberView.textContent = null;
				}

				public onUpdate(diceSet: DiceSet, values: number[]): void {
					numberView.textContent = String(values.reduce((sum, x) => sum + x, 0));
				}

				public onStop(diceSet: DiceSet, results: number[]): void {
					numberView.textContent = String(results.reduce((sum, x) => sum + x, 0));
				}
			});
		}
	});
}