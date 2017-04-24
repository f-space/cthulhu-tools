///<reference path="../view/__index__.ts"/>

namespace Cthulhu {
	const SELETED_CLASS = "selected";

	function handleSelectionEvent(): void {
		const elements = <[Page, HTMLElement][]>[
			[Page.Home, document.getElementById("home")],
			[Page.Dice, document.getElementById("dice")],
			[Page.Status, document.getElementById("status")],
			[Page.Dice, document.getElementById("menu-dice")],
			[Page.Status, document.getElementById("menu-status")],
		].filter(x => x[1] != null);

		Application.PageManager.addListener(new class {
			public onEnter(page: Page): void {
				for (const element of elements) {
					if (element[0] === page) {
						element[1].classList.add(SELETED_CLASS);
					}
				}
			}

			public onExit(page: Page): void {
				for (const element of elements) {
					if (element[0] === page) {
						element[1].classList.remove(SELETED_CLASS);
					}
				}
			}
		});
	}

	function initNavigation(): void {
		const title = document.getElementById("title");
		const diceMenu = document.getElementById("menu-dice");
		const statusMenu = document.getElementById("menu-status");

		if (title) title.addEventListener("click", () => Application.PageManager.toPage(Page.Home));
		if (diceMenu) diceMenu.addEventListener("click", () => Application.PageManager.toPage(Page.Dice));
		if (statusMenu) statusMenu.addEventListener("click", () => Application.PageManager.toPage(Page.Status));
	}

	ViewManager.register(() => {
		handleSelectionEvent();
		initNavigation();
	})
}