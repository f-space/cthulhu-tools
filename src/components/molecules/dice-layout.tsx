import React from 'react';
import { DiceDisplay } from "models/dice";
import { DiceImageManager } from "models/resource";
import { DiceLayout as Layout } from "models/layout/layout";

export interface DiceLayoutProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
	layout: Layout;
	width: number;
	height: number;
	dices: DiceDisplay[][];
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
		await DiceImageManager.load();

		const rects = await this.getRects();

		const context = canvas.getContext('2d');
		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			for (const { image, x, y, size } of rects) {
				context.drawImage(image, x, y, size, size);
			}
		}
	}

	private getRects() {
		const { layout, width, height, dices } = this.props;

		const result = layout.compute(width, height, dices);
		return Promise.all(Array.from(result, async ([dice, rect]) => {
			const src = DiceImageManager.get(dice.type, dice.face);
			const image = await this.getImage(src);
			return { image, ...rect };
		}));
	}

	private getImage(src: string): Promise<HTMLImageElement> {
		if (!this.cache.has(src)) {
			this.cache.set(src, this.loadImage(src));
		}
		return this.cache.get(src)!;
	}

	private loadImage(src: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const image = new Image();
			image.onload = () => resolve(image);
			image.onerror = e => reject(e);
			image.src = src;
		});
	}
}