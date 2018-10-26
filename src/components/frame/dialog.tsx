import React from 'react';
import ReactDOM from 'react-dom';

const Context = React.createContext<React.RefObject<any>>(React.createRef());

export function DialogProvider({ children }: { children: React.ReactNode }) {
	return <Context.Provider value={React.createRef()}>
		{children}
	</Context.Provider>
}

export function DialogSlot({ children }: { children: (ref: React.RefObject<any>) => React.ReactNode }) {
	return <Context.Consumer>
		{children}
	</Context.Consumer>
}

export function DialogPortal({ children }: { children: React.ReactElement<any> }) {
	return <Context.Consumer>
		{value => value.current instanceof Element && <DialogPortalInner container={value.current} children={children} />}
	</Context.Consumer>
}

interface DialogPortalInnerProps {
	container: Element;
	children: React.ReactElement<any>;
}

class DialogPortalInner extends React.Component<DialogPortalInnerProps> {
	public componentDidMount(): void {
		ReactDOM.render(this.props.children, this.props.container);
	}

	public componentWillUnmount(): void {
		ReactDOM.unmountComponentAtNode(this.props.container);
	}

	public componentDidUpdate(prevProps: DialogPortalInnerProps): void {
		if (this.props.container !== prevProps.container) {
			ReactDOM.unmountComponentAtNode(prevProps.container);
		}

		ReactDOM.render(this.props.children, this.props.container);
	}

	public render() {
		return null;
	}
}

export default {
	Provider: DialogProvider,
	Slot: DialogSlot,
	Portal: DialogPortal,
};