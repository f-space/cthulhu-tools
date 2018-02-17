import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';

class Hub {
	public element: HTMLElement | null = null;
	private readonly subscribers: Set<Function> = new Set();

	public set(element: HTMLElement | null): void {
		this.element = element;
		this.subscribers.forEach(subscriber => subscriber(element));
	}

	public subscribe(subscriber: Function): void {
		this.subscribers.add(subscriber);
	}

	public unsubscribe(subscriber: Function): void {
		this.subscribers.delete(subscriber);
	}
}

export function createSlotComponents(key: PropertyKey) {
	const contextTypes = { [key]: PropTypes.instanceOf(Hub).isRequired };

	class Provider extends React.Component {
		public static childContextTypes = contextTypes;

		private readonly hub: Hub = new Hub();

		public getChildContext() { return { [key]: this.hub }; }

		public render() { return <React.Fragment>{this.props.children}</React.Fragment> }
	}

	type Elements = JSX.IntrinsicElements;
	class Slot<K extends keyof Elements = 'div'> extends React.Component<Elements[K] & { tag?: K }> {
		public static contextTypes = contextTypes;

		public get hub(): Hub { return this.context[key]; }

		public render() {
			const { tag = 'div', children, ...rest } = this.props as any;

			return React.createElement(tag, {
				...rest,
				ref: el => { this.hub.set(el); }
			}, children);
		}
	}

	class Portal extends React.Component {
		public static contextTypes = contextTypes;

		private update = () => this.forceUpdate();

		public get hub(): Hub { return this.context[key]; }

		public componentDidMount() { this.hub.subscribe(this.update); }
		public componentWillUnmount() { this.hub.unsubscribe(this.update); }

		public render() {
			const container = this.hub.element;

			return container && ReactDOM.createPortal(this.props.children, container);
		}
	}

	return { Provider, Slot, Portal };
}