namespace Cthulhu {
	export enum Page {
		Home,
		Dice,
		Status,
	}

	export class PageManager {
		private constructor() { }

		public static readonly SELECTED_CLASS = "selected";

		private static elements: Map<Page, HTMLElement[]> = new Map();

		public static register(page: Page, element: HTMLElement): void {
			let list = this.elements.get(page);
			if (list == null) {
				this.elements.set(page, list = []);
			}

			list.push(element);
		}

		public static unregister(page: Page, element: HTMLElement): void {
			const list = this.elements.get(page);
			if (list != null) {
				const index = list.indexOf(element);
				if (index >= 0) list.splice(index, 1);
			}
		}

		public static toPage(next: Page): void {
			const className = this.SELECTED_CLASS;
			for (const [page, elementList] of this.elements) {
				if (page === next) {
					elementList.forEach(element => element.classList.add(className))
				} else {
					elementList.forEach(element => element.classList.remove(className))
				}
			}
		}

		public static toHomePage(): void {
			this.toPage(Page.Home);
		}

		public static toDicePage(): void {
			this.toPage(Page.Dice);
		}

		public static toStatusPage(): void {
			this.toPage(Page.Status);
		}
	}
}