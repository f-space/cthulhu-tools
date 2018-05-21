import React from 'react';
import ReactDOM from 'react-dom';

interface DialogContext {
	readonly container: Element | null;
}

type ContainerSetter = (value: Element | null) => void;

const Container = React.createContext<Element | null>(null);
const Setter = React.createContext<ContainerSetter>(() => { });

export class DialogProvider extends React.Component<{}, DialogContext> {
	private setter: ContainerSetter;

	public constructor(props: {}) {
		super(props);

		this.state = { container: null };
		this.setter = container => this.setState({ container });
	}

	public render() {
		return <Setter.Provider value={this.setter}>
			<Container.Provider {...this.props} value={this.state.container} />
		</Setter.Provider>
	}
}

export function DialogSlot(props: { children: (ref: (instance: Element | null) => void) => React.ReactNode }) {
	return <Setter.Consumer>
		{value => props.children(value)}
	</Setter.Consumer>
}

export function DialogPortal(props: { children: React.ReactNode }) {
	return <Container.Consumer>
		{value => value && ReactDOM.createPortal(props.children, value)}
	</Container.Consumer>
}

export default {
	Provider: DialogProvider,
	Slot: DialogSlot,
	Portal: DialogPortal,
};