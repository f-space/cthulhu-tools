///<reference path="../view/__index__.ts"/>

namespace Cthulhu {
	const SELETED_CLASS = "selected";
	const manager = new PageManager(Page.Home);

	function handleSelectionEvent(): void {
		const elements = <[Page, HTMLElement][]>[
			[Page.Home, document.getElementById("home")],
			[Page.Dice, document.getElementById("dice")],
			[Page.Status, document.getElementById("status")],
			[Page.Dice, document.getElementById("menu-dice")],
			[Page.Status, document.getElementById("menu-status")],
		].filter(x => x[1] != null);

		manager.addListener(new class {
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

		if (title) title.addEventListener("click", () => manager.toPage(Page.Home));
		if (diceMenu) diceMenu.addEventListener("click", () => manager.toPage(Page.Dice));
		if (statusMenu) statusMenu.addEventListener("click", () => manager.toPage(Page.Status));
	}

	ViewManager.register(() => {
		handleSelectionEvent();
		initNavigation();
	})
}