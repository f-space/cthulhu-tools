import { Page } from "view/page";
import { navigation } from "./application";

export default function () {
	initPageSwitch();
	initNavigation();
	initOverlay();
}

function initPageSwitch(): void {
	const elements = Array.from(document.querySelectorAll("[data-page]")) as HTMLElement[];
	navigation.addListener(new class {
		public onEnter(page: Page): void {
			for (const element of elements) {
				if (element.dataset['page'] === page) {
					element.classList.add('selected');
				}
			}
		}

		public onExit(page: Page): void {
			for (const element of elements) {
				if (element.dataset['page'] === page) {
					element.classList.remove('selected');
				}
			}
		}
	});
}

function initNavigation(): void {
	const elements = Array.from(document.querySelectorAll("[data-nav]")) as HTMLElement[];
	for (const element of elements) {
		element.addEventListener('click', () => navigation.toPage(element.dataset['nav'] as Page));
	}
}

function initOverlay(): void {
	const overlays = Array.from(document.querySelectorAll(".page > .overlay")) as HTMLElement[];
	for (const overlay of overlays) {
		const refresh = () => {
			const parent = overlay.parentElement as HTMLElement;
			const children = Array.from(overlay.children);
			if (children.some(child => window.getComputedStyle(child).display !== 'none')) {
				parent.classList.add('overlaid');
			} else {
				parent.classList.remove('overlaid');
			}
		};

		const observer = new MutationObserver(mutations => {
			for (const mutation of mutations) {
				const dialog = mutation.target;
				if (dialog instanceof HTMLElement && dialog.classList.contains('dialog')) {
					refresh();
				}
			}
		});

		observer.observe(overlay, { attributes: true, attributeFilter: ['class'], subtree: true });
	}
}
