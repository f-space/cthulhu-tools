import React from 'react';

type Callback = (event: BeforeInstallPromptEvent) => void;

let deferred: BeforeInstallPromptEvent | undefined;
let callback: Callback | undefined;

window.addEventListener('beforeinstallprompt', e => {
	e.preventDefault();

	if (callback) {
		callback(e as BeforeInstallPromptEvent);
	} else {
		deferred = e as BeforeInstallPromptEvent;
	}
});

function fetch(): BeforeInstallPromptEvent | undefined {
	const result = deferred;
	deferred = undefined;
	return result;
}

function register(cb: Callback): void {
	if (callback) throw new Error("Callback function already registered.");
	callback = cb;
}

function unregister(cb: Callback): void {
	if (callback !== cb) throw new Error("Callback function not registered.");
	callback = undefined;
}

export type Prompt = () => Promise<boolean>;

export interface InstallPromptProps {
	children: (prompt?: Prompt) => React.ReactNode;
}

interface InstallPromptState {
	prompt?: Prompt;
}

export class InstallPrompt extends React.Component<InstallPromptProps, InstallPromptState> {
	public constructor(props: InstallPromptProps) {
		super(props);

		this.state = { prompt: this.getPromptObject(fetch()) }
		this.handleBeforeInstallPrompt = this.handleBeforeInstallPrompt.bind(this);
	}

	public componentDidMount(): void {
		register(this.handleBeforeInstallPrompt);
	}

	public componentWillUnmount(): void {
		unregister(this.handleBeforeInstallPrompt);
	}

	public render() {
		return this.props.children(this.state.prompt);
	}

	private handleBeforeInstallPrompt(event: BeforeInstallPromptEvent): void {
		this.setState({ prompt: this.getPromptObject(event) })
	}

	private handlePrompt(key: [BeforeInstallPromptEvent]): Promise<boolean> {
		const [event] = key;
		delete key[0];

		if (event) {
			return new Promise((resolve, reject) => {
				this.setState({ prompt: undefined }, () => {
					event.prompt();
					event.userChoice.then(({ outcome }) => resolve(outcome === 'accepted')).catch(reject);
				});
			});
		} else {
			return Promise.reject("Prompt can't be called twice.");
		}
	}

	private getPromptObject(event?: BeforeInstallPromptEvent): Prompt | undefined {
		return event && this.handlePrompt.bind(this, [event]);
	}
}

