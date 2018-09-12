import React from 'react';
import classNames from 'classnames';
import { SpringTrack, TrackData } from "components/functions/spring-track";
import { Flick, FlickEvent } from "components/functions/flick";
import style from "styles/molecules/carousel.scss";

export interface CarouselProps<T> {
	models: ReadonlyArray<T>;
	wrap: boolean;
	defaultIndex: number;
	children: (context: CarouselContext<T>) => React.ReactNode;
}

export interface CarouselViewProps<T> extends React.HTMLAttributes<HTMLDivElement> {
	context: CarouselContext<T>;
	vertical: boolean;
	spring: CarouselSpringConfig;
	flick: CarouselFlickConfig;
	children?: React.ReactNode;
	render: (model: T, index: number) => React.ReactNode;
}

export interface CarouselContext<T> {
	readonly models: ReadonlyArray<T>;
	readonly index: number;
	readonly target: number;
	readonly data: TrackData;
	readonly layout: TrackLayout;
	move(index: number): void;
	shift(delta: number): void;
}

export interface CarouselSpringConfig {
	dumping?: number;
	frequency?: number;
	timeStep?: number;
	maxIteration?: number;
}

export interface CarouselFlickConfig {
	speedThreshold?: number;
	distanceThreshold?: number;
}

interface CarouselState {
	target: number;
	data: TrackData;
	prevWrap: boolean;
	prevLength: number;
}

function modulo(x: number, n: number): number {
	return ((x % n) + n) % n;
}

export class Carousel<T> extends React.Component<CarouselProps<T>, CarouselState> {
	public static defaultProps = {
		wrap: false,
		defaultIndex: 0,
	};

	public constructor(props: CarouselProps<T>) {
		super(props);

		const target = props.defaultIndex;
		const data = { position: target, velocity: 0 };
		const prevWrap = props.wrap;
		const prevLength = props.models.length;

		this.state = { target, data, prevWrap, prevLength };
		this.move = this.move.bind(this);
		this.shift = this.shift.bind(this);
	}

	public static getDerivedStateFromProps<T>(props: CarouselProps<T>, state: CarouselState): Partial<CarouselState> | null {
		const prevWrap = state.prevWrap;
		const nextWrap = props.wrap;
		const prevLength = state.prevLength;
		const nextLength = props.models.length;
		if (nextWrap !== prevWrap || nextLength !== prevLength) {
			const result = { prevWrap: nextWrap, prevLength: nextLength };

			const prevInvalid = prevWrap && prevLength === 0;
			const nextInvalid = nextWrap && nextLength === 0;
			if (prevInvalid || nextInvalid) {
				const target = 0;
				const data = { position: 0, velocity: 0 };
				Object.assign(result, { target, data });
			} else {
				let target, shift;
				if (prevWrap) {
					const posShift = Math.floor(state.data.position / prevLength);
					const position = state.data.position - posShift * prevLength;
					const velocity = state.data.velocity;
					Object.assign(result, { data: { position, velocity } });

					target = modulo(state.target, prevLength);
					shift = Math.floor(state.target / prevLength) - posShift;
				} else {
					target = state.target;
					shift = 0;
				}

				if (nextWrap) {
					target = target + shift * nextLength;
				} else {
					target = Math.max(Math.min(target, nextLength - 1), 0);
				}

				Object.assign(result, { target });
			}

			return result;
		}

		return null;
	}

	public render() {
		const { models, children } = this.props;
		const { target, data } = this.state;
		const { move, shift } = this;

		const index = this.index(target);
		const layout = this.layout();
		const context = { models, index, target, data, layout, move, shift };

		return children(context);
	}

	private index(position: number): number {
		const { models, wrap } = this.props;

		if (!wrap) {
			return position;
		} else if (models.length !== 0) {
			return modulo(position, models.length);
		} else {
			return NaN;
		}
	}

	private layout(): TrackLayout {
		const { models, wrap } = this.props;
		const length = models.length;

		return !wrap ? new CarouselTrackLayout(length) : new CarouselWrappedTrackLayout(length);
	}

	private move(index: number): void {
		const { models, wrap } = this.props;

		if (!wrap) {
			const target = Math.max(Math.min(index, models.length - 1), 0);
			this.setTarget(target);
		} else if (models.length !== 0) {
			const origin = this.state.target;
			const relative = modulo(index - origin, models.length);
			const offset = (relative < models.length / 2) ? 0 : models.length;
			const target = origin + relative - offset;
			this.setTarget(target);
		}
	}

	private shift(delta: number): void {
		const { models, wrap } = this.props;

		if (!wrap) {
			this.move(this.state.target + delta);
		} else if (models.length !== 0) {
			this.setTarget(this.state.target + delta);
		}
	}

	private setTarget(target: number): void {
		if (target !== this.state.target) {
			this.setState({ target });
		}
	}
}

export class CarouselView<T> extends React.Component<CarouselViewProps<T>> {
	public static defaultProps = {
		vertical: false,
		spring: {},
		flick: {},
	};

	private frame: React.RefObject<HTMLDivElement> = React.createRef();

	public constructor(props: CarouselViewProps<T>) {
		super(props);

		this.handleFlick = this.handleFlick.bind(this);
	}

	public render() {
		const {
			className,
			context: { models, target, data, layout },
			vertical,
			spring,
			flick,
			render,
			children,
			...rest
		} = this.props;

		const frameClass = classNames(
			className,
			style['frame'],
			{ [style['vertical']]: vertical }
		);

		return <Flick {...flick} vertical={vertical} onFlick={this.handleFlick}>
			{
				props => <SpringTrack
					{...spring}
					target={target}
					state={data}
					select={this.select.bind(this)}
					postrender={this.postrender.bind(this)}
					render={(key: number) => (i => render(models[i], i))(layout.index(key))}>
					{
						items => <div {...rest} {...props} className={frameClass} ref={this.frame}>
							{
								models.length !== 0
									? items.map(({ node, key }) => <div key={key} className={style['item']}>{node}</div>)
									: children
							}
						</div>
					}
				</SpringTrack>
			}
		</Flick>
	}

	private handleFlick(event: FlickEvent): void {
		this.props.context.shift(event.delta > 0 ? -1 : 1);
	}

	private select(data: TrackData): number[] {
		const { layout } = this.props.context;
		const { position } = data;

		return layout.items(position, position + 1);
	}

	private postrender(data: TrackData, items: ReadonlyArray<number>): void {
		const { layout } = this.props.context;

		const frame = this.frame.current;
		if (frame) {
			for (const [index, item] of items.entries()) {
				const element = frame.children[index];
				if (element instanceof HTMLElement) {
					const position = layout.position(item) - data.position;
					const size = layout.size(item);

					set(element, '--item-position', String(position));
					set(element, '--item-size', String(size));
				}
			}
		}

		function set(element: HTMLElement, name: string, value: string): void {
			const current = element.style.getPropertyValue(name);
			if (value !== current) {
				element.style.setProperty(name, value);
			}
		}
	}
}

interface TrackLayout {
	items(start: number, end: number): number[];
	position(item: number): number;
	size(item: number): number;
	index(item: number): number;
}

class CarouselTrackLayout implements TrackLayout {
	public constructor(readonly length: number) { }

	public items(start: number, end: number): number[] {
		const startIndex = Math.max(Math.floor(start), 0);
		const endIndex = Math.min(Math.ceil(end), this.length);
		const count = Math.max(endIndex - startIndex, 0);

		return [...Array(count)].map((_, i) => i + startIndex);
	}

	public position(item: number): number {
		return item;
	}

	public size(item: number): number {
		return 1;
	}

	public index(item: number): number {
		return item;
	}
}

class CarouselWrappedTrackLayout implements TrackLayout {
	public constructor(readonly length: number) { }

	public items(start: number, end: number): number[] {
		if (this.length !== 0) {
			const startIndex = Math.floor(start);
			const endIndex = Math.ceil(end);
			const count = Math.max(endIndex - startIndex, 0);

			return [...Array(count)].map((_, i) => i + startIndex);
		} else {
			return [];
		}
	}

	public position(item: number): number {
		return item;
	}

	public size(item: number): number {
		return 1;
	}

	public index(item: number): number {
		return modulo(item, this.length);
	}
}