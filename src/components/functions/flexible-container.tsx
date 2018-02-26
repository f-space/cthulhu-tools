import React, { ReactNode } from 'react';

export interface FlexibleContainerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	render(size: { width: number, height: number }): ReactNode;
}

export interface FlexibleContainerState {
	width: number;
	height: number;
}

export default class FlexibleContainer extends React.Component<FlexibleContainerProps, FlexibleContainerState> {
	private container?: HTMLDivElement | null;

	public constructor(props: FlexibleContainerProps, context: any) {
		super(props, context);

		this.state = { width: 0, height: 0 };
		this.handleResize = this.handleResize.bind(this);
	}

	public componentDidMount(): void {
		this.updateSize();

		window.addEventListener('resize', this.handleResize);
	}

	public componentWillUnmount(): void {
		window.removeEventListener('resize', this.handleResize);
	}

	public render() {
		const { render, ...rest } = this.props;

		return <div {...rest} ref={el => { this.container = el; }}>
			{
				this.state.width !== 0 && this.state.height !== 0
					? render(this.state)
					: null
			}
		</div>
	}

	private handleResize(): void { this.updateSize(); }

	private updateSize(): void {
		if (this.container) {
			const width = this.container.clientWidth;
			const height = this.container.clientHeight;
			this.setState({ width, height });
		}
	}
}