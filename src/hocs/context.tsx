import * as React from 'react';
import * as PropTypes from 'prop-types';

interface ProviderProps<T> {
	value: T;
}

interface ReceiverProps<T> {
	render(value: T): React.ReactNode;
}

export class Hub {
	public readonly subscribers: Set<Function> = new Set();

	public notify(): void {
		this.subscribers.forEach(subscriber => subscriber());
	}

	public subscribe(subscriber: Function): void {
		this.subscribers.add(subscriber);
	}

	public unsubscribe(subscriber: Function): void {
		this.subscribers.delete(subscriber);
	}
}

export function createComponents<T extends Hub>(key: string) {
	return {
		Provider: createProvider<T>(key),
		Receiver: createReceiver<T>(key),
		Observer: createObserver<T>(key),
	};
}

export function createProvider<T>(key: string) {
	return class ContextProvider extends React.Component<ProviderProps<T>> {
		public static displayName = `ContextProvider<${key}>`;
		public static childContextTypes = { [key]: PropTypes.any.isRequired };

		public getChildContext() { return { [key]: this.props.value }; }

		public render() { return this.props.children; }
	};
}

export function createReceiver<T>(key: string) {
	return class ContextReceiver extends React.Component<ReceiverProps<T>> {
		public static displayName = `ContextReceiver<${key}>`;
		public static contextTypes = { [key]: PropTypes.any.isRequired };

		public render() { return this.props.render(this.context[key]); }
	}
}

export function createObserver<T extends Hub>(key: string) {
	return class ContextObserver extends React.Component<ReceiverProps<T>> {
		public static displayName = `ContextObserver<${key}>`;
		public static contextTypes = { [key]: PropTypes.any.isRequired };

		private readonly callback = this.forceUpdate.bind(this);

		private get value(): T { return this.context[key]; }

		public componentDidMount() { this.value.subscribe(this.callback); }
		public componentWillUnmount() { this.value.unsubscribe(this.callback); }

		public render() { return this.props.render(this.context[key]); }
	};
}