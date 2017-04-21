namespace Cthulhu {
	export type ViewCallback = () => void;

	export class ViewManager {
		private constructor() { }

		private static _callbacks: ViewCallback[] = [];

		public static init(): void {
			document.addEventListener("DOMContentLoaded", () => {
				for (const callback of this._callbacks) {
					callback();
				}
			});
		}

		public static register(callback: ViewCallback): void {
			this._callbacks.push(callback);
		}
	}

	ViewManager.init();
}