import React from 'react';
import { Track, TrackProps } from "components/functions/track";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface SpringTrackProps<K> extends Omit<TrackProps<TrackData, K>, 'update'> {
	target: number;
	dumping: number;
	frequency: number;
	timeStep: number;
	maxIteration: number;
}

export interface TrackData {
	position: number;
	velocity: number;
}

const POSITION_THRESHOLD = 1e-3;
const VELOCITY_THRESHOLD = 1e-3;

export class SpringTrack<K> extends React.Component<SpringTrackProps<K>>{
	public static defaultProps = {
		dumping: 1,
		frequency: 10,
		timeStep: 20,
		maxIteration: 10,
	};

	public render() {
		const { target, dumping, frequency, timeStep, maxIteration, ...rest } = this.props;

		return <Track update={this.update.bind(this)} {...rest} />
	}

	private update(data: TrackData, time: [number, number]): boolean {
		const { target } = this.props;

		const { position, velocity } = this.simulate(data, time);
		const moving = this.isMoving(position, velocity, target);
		if (moving) {
			data.position = position;
			data.velocity = velocity;
		} else {
			data.position = target;
			data.velocity = 0;
		}

		return moving;
	}

	private simulate(data: TrackData, time: [number, number]): TrackData {
		const { target, dumping, frequency, timeStep, maxIteration } = this.props;

		const done = Math.floor(time[0] / timeStep);
		const required = Math.floor(time[1] / timeStep);
		const iteration = Math.min(required - done, maxIteration);

		let { position, velocity } = data;
		for (let i = 0; i < iteration; i++) {
			const dumper = -(velocity * dumping * frequency * 2);
			const spring = -((position - target) * frequency * frequency);
			const accelration = dumper + spring;

			const dt = timeStep / 1000;
			const v0 = velocity;
			const v1 = v0 + accelration * dt;

			position = position + (v1 + v0) * dt / 2;
			velocity = v1;
		}

		return { position, velocity };
	}

	private isMoving(position: number, velocity: number, target: number): boolean {
		return Math.abs(velocity) > VELOCITY_THRESHOLD
			|| Math.abs(position - target) > POSITION_THRESHOLD;
	}
}