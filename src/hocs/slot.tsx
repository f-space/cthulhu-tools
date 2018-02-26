import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Hub, createComponents as createContextComponents } from "hocs/context";

interface SlotProps {
	children: React.ReactElement<any>
}

interface PortalProps {
	children?: React.ReactNode;
}

class SlotHub extends Hub {
	public element: HTMLElement | null = null;

	public set(element: HTMLElement | null): void {
		this.element = element;
		this.notify();
	}
}

export function createComponents(key: string) {
	const { Provider, Receiver, Observer } = createContextComponents<SlotHub>(key);

	class SlotProvider extends React.Component {
		private readonly hub = new SlotHub();

		public render() {
			return <Provider {...this.props} value={this.hub} />
		}
	}

	const Slot = function (props: SlotProps) {
		return <Receiver render={hub => {
			return React.cloneElement(props.children, {
				ref: (el: HTMLElement | null) => { hub.set(el); }
			});
		}} />
	}

	const SlotPortal = function (props: PortalProps) {
		return <Observer render={hub => {
			const container = hub.element;

			return container && ReactDOM.createPortal(props.children, container);
		}} />
	}

	return { SlotProvider, Slot, SlotPortal };
}