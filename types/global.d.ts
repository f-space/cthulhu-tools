interface Element {
	onerror: ElementErrorEventHandler;
}

interface ElementErrorEventHandler {
	(event: ErrorEvent): void;
}

interface HTMLCanvasElement {
	msToBlob?(): Blob;
}