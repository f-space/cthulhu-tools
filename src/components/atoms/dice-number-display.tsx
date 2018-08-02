import React from 'react';
import classNames from 'classnames';
import style from "styles/atoms/dice-number-display.scss";

export interface DiceNumberDisplayProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	width: number;
	height: number;
	scaleX?: number;
	scaleY?: number;
	digits: number;
	value: number | undefined;
	critical?: boolean;
	fumble?: boolean;
}

interface DiceNumberDisplayState {
	textAspectRatio?: number;
}

export class DiceNumberDisplay extends React.Component<DiceNumberDisplayProps, DiceNumberDisplayState> {
	public static defaultProps: Readonly<Partial<DiceNumberDisplayProps>> = {
		scaleX: 0.95,
		scaleY: 0.75,
	};

	private canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();

	public constructor(props: DiceNumberDisplayProps) {
		super(props);

		this.state = {};
	}

	public componentDidMount(): void {
		this.updateTextAspectRatio(this.props);
	}

	public componentDidUpdate(prevProps: DiceNumberDisplayProps): void {
		if (this.props.digits !== prevProps.digits) {
			this.updateTextAspectRatio(this.props);
		}
	}

	public render() {
		const { width, height, scaleX, scaleY, digits, value, critical, fumble, className, ...rest } = this.props;
		const fontSize = this.getFontSize();

		return <div {...rest} className={classNames(className, style['display'])} style={{ fontSize }}>
			<canvas className={style['canvas']} width={0} height={0} hidden ref={this.canvasRef} />
			<span className={classNames(style['text'], { critical, fumble })}>{value}</span>
		</div>
	}

	private getFontSize(): number {
		const ratio = this.state.textAspectRatio || Infinity;
		const maxHeight = this.props.height * this.props.scaleY!;
		const preferredHeight = this.props.width * this.props.scaleX! / ratio;
		return Math.min(maxHeight, preferredHeight);
	}

	private updateTextAspectRatio({ digits }: DiceNumberDisplayProps): void {
		const textAspectRatio = this.measureAspectRatio("0".repeat(digits));

		this.setState({ textAspectRatio });
	}

	private measureAspectRatio(text: string): number | undefined {
		const canvas = this.canvasRef.current;
		if (canvas) {
			const context = canvas.getContext('2d');
			if (context) {
				const style = window.getComputedStyle(canvas);
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