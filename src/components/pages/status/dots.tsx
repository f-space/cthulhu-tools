import React from 'react';
import classNames from 'classnames';
import style from "./dots.scss";

interface DotsProps {
	length: number;
	index?: number;
}

export function Dots({ length, index }: DotsProps) {
	return <span className={style['dots']}>
		{
			[...Array(length)].map((_, i) =>
				<span key={i} className={classNames(style['dot'], { [style['active']]: i === index })} />
			)
		}
	</span>
}