interface Element {
	onerror: ElementErrorEventHandler;
}

interface ElementErrorEventHandler {
	(event: ErrorEvent): void;
}

interface BeforeInstallPromptEvent extends Event {
	userChoice: Promise<PromptResponseObject>;
	prompt(): Promise<void>;
}

interface PromptResponseObject {
	outcome: AppBannerPromptOutcome;
}

type AppBannerPromptOutcome = 'accepted' | 'dismissed';