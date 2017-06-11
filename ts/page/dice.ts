import { DiceSet } from "model/dice";
import { DiceManager, DiceRollEventType } from "model/dice-roll";
import DiceImage from "view/dice-image";
import DiceRenderer from "view/dice-renderer";
import DiceNumberRenderer from "view/dice-number-renderer";
import { resources } from "./application";

let page: HTMLElement;
let dialog: HTMLElement;
const manager = new DiceManager();

export default function (): void {
	page = document.getElementById("dice") as HTMLElement;
	dialog = document.getElementById("custom-dice-dialog") as HTMLElement;

	initDiceSet();
	initRollButton();
	initRollSound();
	initDiceView();
	initNumberView();
	initCustomDiceDialog();
}

function initDiceSet(): void {
	const elements = Array.from(page.querySelectorAll(".mode-list .mode")) as HTMLElement[];
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
	const rollButton = page.querySelector(".roll-button") as HTMLButtonElement;

	rollButton.addEventListener("click", () => { manager.roll() });
}

function initRollSound(): void {
	manager.addListener(new class {
		public onRoll(manager: DiceManager, type: DiceRollEventType) {
			if (type === DiceRollEventType.Start) {
				const sound = resources.diceSound;
				sound.pause();
				sound.currentTime = 0;
				sound.play();
			}
		}
	}());
}

function initDiceView(): void {
	const diceView = page.querySelector(".result .dice-view") as HTMLElement;

	manager.addListener(new DiceRenderer(diceView, resources.diceImage, 'dice-group', 'dice'));
}

function initNumberView(): void {
	const numberView = page.querySelector(".result .number-view") as HTMLElement;

	manager.addListener(new DiceNumberRenderer(numberView, 'critical', 'fumble'));
}

function initCustomDiceDialog(): void {
	const okButton = dialog.querySelector(".ok") as HTMLButtonElement;
	const cancelButton = dialog.querySelector(".cancel") as HTMLButtonElement;

	okButton.addEventListener("click", () => { closeCustomDiceDialog(false); });
	cancelButton.addEventListener("click", () => { closeCustomDiceDialog(true); });
}

function openCustomDiceDialog(): void {
	dialog.classList.add('open');
}

function closeCustomDiceDialog(cancel: boolean): void {
	dialog.classList.remove('open');

	if (!cancel) registerCustomDice();
}

function registerCustomDice(): void {
	const countInput = dialog.querySelector(".count") as HTMLInputElement;
	const maxInput = dialog.querySelector(".max") as HTMLInputElement;

	if (countInput.validity.valid && maxInput.validity.valid) {
		const id = 'custom';
		const count = parseInt(countInput.value, 10);
		const max = parseInt(maxInput.value, 10);
		const diceSet = DiceSet.create(count, max);

		manager.register(id, diceSet);
		manager.select(id);
	}
}