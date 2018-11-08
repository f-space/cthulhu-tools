import React from 'react';
import classNames from 'classnames';
import style from "./center.scss";

export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function Center({ className, children, ...rest }: CenterProps) {
	return <div {...rest} className={classNames(className, style['container'])}>
		{React.Children.only(children)}
	</div>
}