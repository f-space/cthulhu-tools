import React from 'react';

export interface RepeatTaskProps {
	active: boolean;
	interval: number;
	callback: (iteration: number) => void;
}

export class RepeatTask extends React.Component<RepeatTaskProps> {
	private id?: number;
	private count!: number;

	public componentDidMount(): void {
		if (this.props.active) this.activate();
	}

	public componentWillUnmount(): void {
		if (this.props.active) this.deactivate();
	}

	public componentDidUpdate(prevProps: RepeatTaskProps): void {
		if (this.props.active !== prevProps.active) {
			if (this.props.active) {
				this.activate();
			} else {
				this.deactivate();
			}
		} else if (this.props.active && this.props.interval !== prevProps.interval) {
			this.refresh();
		}
	}

	public render() { return null; }

	private activate(): void {
		this.resetCount();
		this.beginTask();
	}

	private deactivate(): void {
		this.endTask();
	}

	private refresh(): void {
		this.endTask();
		this.beginTask();
	}

	private resetCount(): void {
		this.count = 0;
	}

	private beginTask(): void {
		if (this.id === undefined) {
			this.id = window.setInterval(() => {
				this.props.callback(this.count++);
			}, this.props.interval);
		}
	}

	private endTask(): void {
		if (this.id !== undefined) {
			window.clearTimeout(this.id);
			this.id = undefined;
		}
	}
}