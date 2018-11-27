import React from 'react';
import { DiceImageStore, DiceImageResource } from "models/resource";

export enum DiceImageLoadState {
	Loading,
	Done,
	Error,
}

export interface DiceImageLoaderProps {
	children: (state: DiceImageLoadState, store?: DiceImageStore) => React.ReactNode;
}

interface DiceImageLoaderState {
	state: DiceImageLoadState;
	store?: DiceImageStore;
}

export class DiceImageLoader extends React.Component<DiceImageLoaderProps, DiceImageLoaderState> {
	private mounted!: boolean;

	public constructor(props: DiceImageLoaderProps) {
		super(props);

		this.state = { state: DiceImageLoadState.Loading };
	}

	public componentDidMount(): void {
		this.mounted = true;

		DiceImageResource.global().then(store => {
			if (this.mounted) this.setState({ state: DiceImageLoadState.Done, store });
		}).catch(() => {
			if (this.mounted) this.setState({ state: DiceImageLoadState.Error });
		});
	}

	public componentWillUnmount(): void {
		this.mounted = false;
	}

	public render() {
		const { children } = this.props;
		const { state, store } = this.state;

		return children(state, store);
	}
}