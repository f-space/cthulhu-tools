export class DiceImage {
	public readonly source: HTMLImageElement;
	public readonly layout: DiceImageLayout;

	public constructor(source: HTMLImageElement, layout: DiceImageLayout) {
		this.source = source;
		this.layout = layout;
	}

	public draw(canvas: HTMLCanvasElement, type: string, face: number): void {
		const faces = this.layout[type];
		const rect = faces && faces[face];

		if (this.source.complete && rect) {
			const { x, y, w, h } = rect;
			canvas.width = w;
			canvas.height = h;

			const context = canvas.getContext('2d');
			if (context) {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(this.source, x, y, w, h, 0, 0, canvas.width, canvas.height);
			}
		} else {
			canvas.width = 0;
			canvas.height = 0;
		}
	}
}

export interface DiceImageLayout {
	readonly [type: string]: ReadonlyArray<DiceImageRect>;
}

export interface DiceImageRect {
	readonly x: number;
	readonly y: number;
	readonly w: number;
	readonly h: number;
}