import React from 'react';
import classNames from 'classnames';
import FlexibleContainer from "components/functions/flexible-container";
import style from "styles/molecules/circle-dice-layout.scss";

export interface CircleDiceLayoutProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	width: number;
	height: number;
}

export default function CircleDiceLayout({ width, height, className, children, ...rest }: CircleDiceLayoutProps) {
	const count = React.Children.count(children);
	const angle = Math.PI * 2 / count;
	const outerRadius = Math.min(width, height) / 2;
	const innerRadius = outerRadius / (1 + Math.sqrt(2 / (1 - Math.cos(angle))));

	const offset = (count % 2 == 0 ? angle * 0.5 : 0);
	const radius = outerRadius - innerRadius;
	const centerX = width / 2;
	const centerY = height / 2;

	return <div {...rest} className={classNames(className, style['layout'])} style={{ '--dice-size': `${innerRadius}px` }}>
		{
			React.Children.map(children, (child, n) => {
				const position = {
					left: centerX - Math.sin(angle * n + offset) * radius,
					top: centerY - Math.cos(angle * n + offset) * radius,
				};

				return <div className={style['container']} style={position}>
					{child}
				</div>
			})
		}
	</div>
}