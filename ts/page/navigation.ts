import { PageManager, Page } from "view/page";

const ID_TO_PAGE = <{ [id: string]: Page }>{
	"home": Page.Home,
	"dice": Page.Dice,
	"status": Page.Status,
	"character-management": Page.CharacterManagement,
	"character-creation": Page.CharacterCreation,
};

const manager = new PageManager(Page.Home);

function initSelectables(): void {
	const selectables = collectPageElements('page');
	manager.addListener(new class {
		public onEnter(page: Page): void {
			for (const [element, trigger] of selectables) {
				if (trigger === page) {
					element.classList.add('selected');
				}
			}
		}

		public onExit(page: Page): void {
			for (const [element, trigger] of selectables) {
				if (trigger === page) {
					element.classList.remove('selected');
				}
			}
		}
	});
}

function initNavigation(): void {
	for (const [element, page] of collectPageElements('nav')) {
		if (page !== undefined) {
			element.addEventListener("click", () => manager.toPage(page));
		}
	}
}

function collectPageElements(attribute: string): [HTMLElement, Page][] {
	return Array.from(<NodeListOf<HTMLElement>>document.querySelectorAll(`[data-${attribute}]`))
		.map<[HTMLElement, Page]>(x => [x, ID_TO_PAGE[<string>x.dataset[attribute]]]);
}

export default function () {
	initSelectables();
	initNavigation();
}