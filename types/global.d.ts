interface Element {
	onerror: ElementErrorEventHandler;
}

interface ElementErrorEventHandler {
	(event: ErrorEvent): void;
}