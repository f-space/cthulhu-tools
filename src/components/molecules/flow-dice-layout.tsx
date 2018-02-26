import React from 'react';
import classNames from 'classnames';
import style from "styles/molecules/flow-dice-layout.scss";

export interface FlowDiceLayoutProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	width: number;
	height: number;
}

export default function FlowDiceLayout({ width, height, className, children, ...rest }: FlowDiceLayoutProps) {
	const count = React.Children.toArray(children)
		.filter(React.isValidElement)
		.map(child => React.Children.count((child.props as any).children))
		.reduce((sum, count) => sum + count, 0);
	const size = Math.floor(Math.sqrt((width * height) / count * 0.75));

	return <div {...rest} className={classNames(className, style['layout'])} style={{ '--dice-size': `${size}px` }}>
		{children}
	</div>
}