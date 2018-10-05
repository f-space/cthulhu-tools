import React from 'react';
import classNames from 'classnames';
import { SpringTrack, TrackData } from "../decorators/spring-track";
import { Flick, FlickEvent } from "../decorators/flick";
import style from "./carousel.scss";

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
	readonly index: number | undefined;
	readonly target: number;
	readonly data: TrackData;
	map(position: number): number | undefined;
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
		this.map = this.map.bind(this);
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
		const { map, move, shift } = this;

		const index = map(target);
		const context = { models, index, target, data, map, move, shift };

		return children(context);
	}

	private map(position: number): number | undefined {
		const { models, wrap } = this.props;

		if (!wrap) {
			return (position >= 0 && position < models.length) ? Math.floor(position) : undefined;
		} else if (models.length !== 0) {
			return Math.floor(modulo(position, models.length));
		} else {
			return undefined;
		}
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
			context: { models, target, data, map },
			vertical,
			spring,
			flick,
			render,
			children,
			...rest
		} = this.props;

		const classList = classNames(className, style['frame'], { [style['vertical']]: vertical });

		return <Flick {...flick} vertical={vertical} onFlick={this.handleFlick}>
			{
				props => <SpringTrack<number>
					{...spring}
					target={target}
					state={data}
					select={this.select.bind(this)}
					postrender={this.postrender.bind(this)}
					render={key => { const index = map(key)!; return render(models[index], index); }}>
					{
						items => <div {...rest} {...props} className={classList} ref={this.frame}>
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
		const { map } = this.props.context;
		const { position } = data;

		const base = Math.floor(position);
		const candidates = base !== position ? [base, base + 1] : [base];
		const keys = candidates.filter(x => map(x) !== undefined);

		return keys;
	}

	private postrender(data: TrackData, items: ReadonlyArray<number>): void {
		const { vertical } = this.props;

		const frame = this.frame.current;
		if (frame) {
			const fn = vertical ? 'translateY' : 'translateX';
			for (const [index, item] of items.entries()) {
				const child = frame.children[index] as HTMLElement;
				const amount = item - data.position;

				if (amount !== 0) {
					child.style.setProperty('transform', `${fn}(${100 * amount}%)`);
				} else {
					child.style.removeProperty('transform');
				}
			}
		}
	}
}
