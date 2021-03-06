import React from 'react';
import { DiceDisplay } from "models/dice";
import { Resources, DiceImageStore } from "models/resource";
import { DiceLayout as Layout, DiceRect } from "models/layout/layout";

export interface DiceLayoutProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
	store: DiceImageStore;
	layout: Layout;
	width: number;
	height: number;
	dices: DiceDisplay[][];
}

interface ImageRect extends DiceRect {
	image: HTMLImageElement;
}

export class DiceLayout extends React.Component<DiceLayoutProps>{
	private ref: React.RefObject<HTMLCanvasElement> = React.createRef();
	private cache: Map<string, Promise<HTMLImageElement>> = new Map();

	public componentDidMount() {
		if (this.ref.current) this.renderDices(this.ref.current);
	}

	public componentDidUpdate() {
		if (this.ref.current) this.renderDices(this.ref.current);
	}

	public render() {
		const { layout, width, height, dices, ...rest } = this.props;

		return <canvas {...rest} width={width} height={height} ref={this.ref} />
	}

	public async renderDices(canvas: HTMLCanvasElement): Promise<void> {
		const rects = await this.getRects();

		const context = canvas.getContext('2d');
		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			for (const { image, x, y, size } of rects) {
				context.drawImage(image, x, y, size, size);
			}
		}
	}

	private getRects(): Promise<ImageRect[]> {
		const { store, layout, width, height, dices } = this.props;

		const result = layout.compute(width, height, dices);
		return Promise.all(Array.from(result, async ([dice, rect]) => {
			const src = store.get(dice.type, dice.face);
			const image = await this.getImage(src);
			return { image, ...rect };
		}));
	}

	private getImage(src: string): Promise<HTMLImageElement> {
		if (!this.cache.has(src)) {
			this.cache.set(src, Resources.loadImage(src));
		}
		return this.cache.get(src)!;
	}
}