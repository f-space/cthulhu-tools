import React from 'react';

interface DialogHub {
	renderers: ReadonlyArray<DialogRenderer>
	open(renderer: DialogRenderer): void;
	close(renderer: DialogRenderer): void;
}

interface DialogRenderer {
	(): React.ReactNode;
}

const Context = React.createContext<DialogHub>({
	renderers: [],
	open() { },
	close() { },
});

export interface DialogProviderProps { }

export class DialogProvider extends React.Component<DialogProviderProps, DialogHub> {
	public state = {
		renderers: [],
		open: (renderer: DialogRenderer) => {
			this.setState(state => {
				return { renderers: [...state.renderers, renderer] };
			});
		},
		close: (renderer: DialogRenderer) => {
			this.setState(state => {
				return { renderers: state.renderers.filter(r => r !== renderer) };
			});
		}
	};

	public render() {
		return <Context.Provider value={this.state}>
			{this.props.children}
		</Context.Provider>
	}
}

export interface DialogSlotProps { }

export function DialogSlot() {
	return <Context.Consumer>
		{({ renderers }) => renderers.length !== 0 ? renderers[0]() : null}
	</Context.Consumer>
}

export interface DialogPortalProps {
	children: DialogRenderer;
}

export class DialogPortal extends React.Component<DialogPortalProps> {
	public static contextType = Context;

	public context!: DialogHub;

	public componentDidMount(): void {
		this.context.open(this.props.children);
	}

	public componentWillUnmount(): void {
		this.context.close(this.props.children);
	}

	public componentDidUpdate(prevProps: DialogPortalProps): void {
		if (this.props.children !== prevProps.children) {
			this.context.close(prevProps.children);
			this.context.open(this.props.children);
		}
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