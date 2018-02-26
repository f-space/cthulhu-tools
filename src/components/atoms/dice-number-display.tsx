import React from 'react';
import classNames from 'classnames';
import style from "styles/atoms/dice-number-display.scss";

export interface DiceNumberDisplayProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	width: number;
	height: number;
	scale?: number;
	digits: number;
	value: number | undefined;
	critical?: boolean;
	fumble?: boolean;
}

export default class DiceNumberDisplay extends React.Component<DiceNumberDisplayProps> {
	public static defaultProps = {
		scale: 0.5,
	};

	private canvas: HTMLCanvasElement | null = null;
	private textAspectRatio?: number;

	public componentDidMount(): void {
		this.updateTextAspectRatio(this.props);
		this.forceUpdate();
	}

	public componentWillUpdate(nextProps: DiceNumberDisplayProps): void {
		if (this.props.digits !== nextProps.digits) {
			this.updateTextAspectRatio(nextProps);
		}
	}

	public render() {
		const { width, height, scale, digits, value, critical, fumble, className, ...rest } = this.props;
		const fontSize = this.getFontSize();

		return <div {...rest} className={classNames(className, style['display'], { critical, fumble })} style={{ fontSize }}>
			<canvas className={style['canvas']} width={0} height={0} hidden ref={canvas => { this.canvas = canvas; }} />
			{value}
		</div>
	}

	private getFontSize(): number {
		const ratio = this.textAspectRatio || Infinity;
		const maxHeight = this.props.height * (this.props.scale as number);
		const preferredHeight = this.props.width / ratio;
		return Math.min(maxHeight, preferredHeight);
	}

	private updateTextAspectRatio({ digits }: DiceNumberDisplayProps): void {
		this.textAspectRatio = this.measureAspectRatio("0".repeat(digits));
	}

	private measureAspectRatio(text: string): number | undefined {
		if (this.canvas) {
			const context = this.canvas.getContext('2d');
			if (context) {
				const style = window.getComputedStyle(this.canvas);
				const font = style.getPropertyValue('font');
				const fontSize = style.getPropertyValue('font-size');

				context.font = font;
				const width = context.measureText(text).width;
				const height = Number.parseFloat(fontSize);

				return (width / height)
			}
		}
		return undefined;
	}
}