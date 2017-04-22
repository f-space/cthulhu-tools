namespace Cthulhu {
	export enum Page {
		Home,
		Dice,
		Status,
	}

	export interface PageListener {
		onEnter?(page: Page): void;
		onExit?(page: Page): void;
	}

	export class PageManager {
		public constructor(page: Page) {
			this._page = page;
		}

		private _page: Page;
		private _listeners: PageListener[] = [];

		public get page(): Page { return this._page; }

		public addListener(listener: PageListener): void {
			const index = this._listeners.indexOf(listener);
			if (index === -1) {
				this._listeners.push(listener);

				if (listener.onEnter) listener.onEnter(this.page);
			}
		}

		public removeListener(listener: PageListener): void {
			const index = this._listeners.indexOf(listener);
			if (index !== -1) {
				this._listeners.splice(index, 1);

				if (listener.onExit) listener.onExit(this.page);
			}
		}

		public toPage(next: Page): void {
			for (const listener of this._listeners) {
				if (listener.onExit) listener.onExit(this.page);
			}

			this._page = next;

			for (const listener of this._listeners) {
				if (listener.onEnter) listener.onEnter(this.page);
			}
		}
	}
}