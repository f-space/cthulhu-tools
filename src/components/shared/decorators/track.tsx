import React from 'react';

export interface TrackProps<S, K> {
	state: S,
	update: (state: S, time: [number, number]) => boolean;
	select: (state: S) => ReadonlyArray<K>;
	postrender: (state: S, keys: ReadonlyArray<K>) => void;
	render: (key: K) => React.ReactNode;
	children: (items: ReadonlyArray<TrackItem<K>>) => React.ReactNode;
	onStart?: (state: S) => void;
	onStop?: (state: S) => void;
}

export interface TrackItem<K> {
	node: React.ReactNode;
	key: K;
}

interface TrackState<S, K> {
	keys: ReadonlyArray<K>;
	prevSelect?: TrackProps<S, K>['select'];
}

function arrayEqual<K>(x: ReadonlyArray<K>, y: ReadonlyArray<K>): boolean {
	if (x.length !== y.length) return false;
	for (let i = 0, length = x.length; i < length; i++) {
		if (x[i] !== y[i]) return false;
	}
	return true;
}

export class Track<S, K> extends React.Component<TrackProps<S, K>, TrackState<S, K>>{
	private requestId?: number;

	public constructor(props: TrackProps<S, K>) {
		super(props);

		this.state = { keys: props.select(props.state) };
	}

	public static getDerivedStateFromProps<S, K>(props: TrackProps<S, K>, state: TrackState<S, K>): Partial<TrackState<S, K>> | null {
		if (props.select !== state.prevSelect) {
			return { keys: props.select(props.state), prevSelect: props.select };
		}
		return null;
	}

	public componentDidMount(): void {
		this.props.postrender(this.props.state, this.state.keys);
	}

	public componentWillUnmount(): void {
		this.stopUpdate();
	}

	public shouldComponentUpdate(nextProps: TrackProps<S, K>, nextState: TrackState<S, K>): boolean {
		return this.props.render !== nextProps.render
			|| this.props.children !== nextProps.children
			|| this.props.postrender !== nextProps.postrender
			|| this.state.keys !== nextState.keys
			|| this.requestId === undefined && (this.props.state !== nextProps.state || this.props.update !== nextProps.update);
	}

	public componentDidUpdate(): void {
		this.postrender();

		this.startUpdate();
	}

	public render() {
		return this.props.children(this.state.keys.map(key => ({ node: this.props.render(key), key })));
	}

	private startUpdate(): void {
		if (this.requestId === undefined) {
			this.requestId = this.requestUpdate(performance.now(), false);
		}
	}

	private stopUpdate(): void {
		if (this.requestId !== undefined) {
			cancelAnimationFrame(this.requestId);
			this.requestId = undefined;
		}
	}

	private requestUpdate(startTime: number, prev: boolean): number {
		return requestAnimationFrame(endTime => {
			const next = this.updateState([startTime, endTime]);
			this.updateVisual();
			this.checkEvents(prev, next);

			this.requestId = next ? this.requestUpdate(endTime, true) : undefined;
		});
	}

	private updateState(time: [number, number]): boolean {
		return this.props.update(this.props.state, time);
	}

	private updateVisual(): void {
		const keys = this.props.select(this.props.state);
		if (!arrayEqual(keys, this.state.keys)) {
			this.setState({ keys });
		} else {
			this.postrender();
		}
	}

	private postrender(): void {
		this.props.postrender(this.props.state, this.state.keys);
	}

	private checkEvents(prev: boolean, next: boolean) {
		if (prev !== next) {
			if (next) {
				this.triggerStartEvent();
			} else {
				this.triggerStopEvent();
			}
		}
	}

	private triggerStartEvent(): void {
		if (this.props.onStart) this.props.onStart(this.props.state);
	}

	private triggerStopEvent(): void {
		if (this.props.onStop) this.props.onStop(this.props.state);
	}
}