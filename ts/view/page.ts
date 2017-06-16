export type Page = 'home' | 'dice' | 'status' | 'character-management' | 'character-creation';

export interface PageListener {
	onEnter?(page: Page, context?: any): void;
	onExit?(page: Page, context?: any): void;
}

export class PageManager {
	public constructor(page: Page) {
		this._page = page;
	}

	private _page: Page;
	private _context: any;
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

	public toPage(next: Page, context?: any, force: boolean = false): void {
		if (this._page !== next || force) {
			for (const listener of this._listeners) {
				if (listener.onExit) listener.onExit(this.page, this._context);
			}

			this._page = next;
			this._context = context;

			for (const listener of this._listeners) {
				if (listener.onEnter) listener.onEnter(this.page, this._context);
			}
		}
	}
}