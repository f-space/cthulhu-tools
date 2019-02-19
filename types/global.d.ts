interface BeforeInstallPromptEvent extends Event {
	userChoice: Promise<PromptResponseObject>;
	prompt(): Promise<void>;
}

interface PromptResponseObject {
	outcome: AppBannerPromptOutcome;
}

type AppBannerPromptOutcome = 'accepted' | 'dismissed';