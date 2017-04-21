namespace Cthulhu {
	function getElementById(id: string): HTMLElement {
		const element = document.getElementById(id);
		if (element == null) throw new Error(`${id} not found.`);
		return element;
	}

	document.addEventListener("DOMContentLoaded", function () {
		PageManager.register(Page.Home, getElementById("home"));
		PageManager.register(Page.Dice, getElementById("menu-dice"));
		PageManager.register(Page.Dice, getElementById("dice"));
		PageManager.register(Page.Status, getElementById("menu-status"));
		PageManager.register(Page.Status, getElementById("status"));

		getElementById("title").addEventListener("click", () => PageManager.toHomePage());
		getElementById("menu-dice").addEventListener("click", () => PageManager.toDicePage());
		getElementById("menu-status").addEventListener("click", () => PageManager.toStatusPage());

		PageManager.toHomePage();
	});
}