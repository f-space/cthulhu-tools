import React, { ReactNode } from 'react';

export interface FlexibleContainerProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	render(size: { width: number, height: number }): ReactNode;
}

interface FlexibleContainerState {
	width: number;
	height: number;
}

export class FlexibleContainer extends React.Component<FlexibleContainerProps, FlexibleContainerState> {
	private ref: React.RefObject<HTMLDivElement> = React.createRef();

	public constructor(props: FlexibleContainerProps) {
		super(props);

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

		return <div {...rest} ref={this.ref}>
			{
				this.state.width !== 0 && this.state.height !== 0
					? render(this.state)
					: null
			}
		</div>
	}

	private handleResize(): void { this.updateSize(); }

	private updateSize(): void {
		const container = this.ref.current;
		if (container) {
			const width = container.clientWidth;
			const height = container.clientHeight;
			this.setState({ width, height });
		}
	}
}