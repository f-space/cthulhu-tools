import React from 'react';

export interface FlickProps {
	vertical: boolean;
	speedThreshold: number;
	distanceThreshold: number;
	onFlick: (event: FlickEvent) => void;
	children: (props: FlickRenderProps) => React.ReactNode;
}

export interface FlickRenderProps {
	onPointerDown: React.PointerEventHandler<Element>;
	onPointerUp: React.PointerEventHandler<Element>;
	onPointerCancel: React.PointerEventHandler<Element>;
	onPointerMove: React.PointerEventHandler<Element>;
}

export interface FlickEvent {
	start: number;
	delta: number;
}

interface Record {
	point: number;
	time: number;
}

const MAX_RECORD_SIZE = 256;

export class Flick extends React.Component<FlickProps> {
	public static defaultProps = {
		vertical: false,
		speedThreshold: 100,
		distanceThreshold: 100,
	};

	private pointerId?: number;
	private records?: Record[];

	public constructor(props: FlickProps) {
		super(props);

		this.handlePointerDown = this.handlePointerDown.bind(this);
		this.handlePointerUp = this.handlePointerUp.bind(this);
		this.handlePointerCancel = this.handlePointerCancel.bind(this);
		this.handlePointerMove = this.handlePointerMove.bind(this);
	}

	public render() {
		const props = {
			onPointerDown: this.handlePointerDown,
			onPointerUp: this.handlePointerUp,
			onPointerCancel: this.handlePointerCancel,
			onPointerMove: this.handlePointerMove,
		};

		return this.props.children(props);
	}

	private handlePointerDown(event: React.PointerEvent<Element>): void {
		if (this.isTarget(event) && this.pointerId === undefined) {
			this.startCapture(event);
		}
	}

	private handlePointerUp(event: React.PointerEvent<Element>): void {
		if (this.isTarget(event) && this.pointerId === event.pointerId) {
			this.detect();
			this.endCapture(event);
		}
	}

	private handlePointerCancel(event: React.PointerEvent<Element>): void {
		if (this.isTarget(event) && this.pointerId === event.pointerId) {
			this.endCapture(event);
		}
	}

	private handlePointerMove(event: React.PointerEvent<Element>): void {
		if (this.pointerId === event.pointerId) {
			this.record(event);
		}
	}

	private isTarget(event: React.PointerEvent<Element>): boolean {
		return event.button === 0 && event.isPrimary;
	}

	private startCapture(event: React.PointerEvent<Element>): void {
		this.pointerId = event.pointerId;
		this.records = [];
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	private endCapture(event: React.PointerEvent<Element>): void {
		this.pointerId = undefined;
		this.records = undefined;
		event.currentTarget.releasePointerCapture(event.pointerId);
	}

	private record(event: React.PointerEvent<Element>): void {
		const records = this.records!;
		const point = this.props.vertical ? event.screenY : event.screenX;
		const time = event.timeStamp;

		records.push({ point, time });

		while (records.length > MAX_RECORD_SIZE) {
			records.shift();
		}
	}

	private detect(): void {
		const { speedThreshold, distanceThreshold } = this.props;
		const records = this.records!.reverse();

		if (records.length >= 2) {
			let next = records[0];
			let dir = Math.sign(records[0].point - records[1].point);
			for (let i = 1; i < records.length; i++) {
				const current = records[i];
				const deltaPosition = next.point - current.point;
				const deltaTime = (next.time - current.time) / 1000;

				if (deltaTime > Number.EPSILON) {
					const velocity = deltaPosition / deltaTime;
					const speed = Math.abs(velocity);
					const direction = Math.sign(velocity);
					if (speed < speedThreshold || direction !== dir) break;
				}

				next = current;
			}

			const start = next.point;
			const end = records[0].point;
			const delta = end - start;
			if (Math.abs(delta) > distanceThreshold) {
				this.props.onFlick({ start, delta });
			}
		}
	}
}