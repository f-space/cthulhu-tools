import React from 'react';
import classNames from 'classnames';
import style from "./spinner.scss";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Spinner({ className, ...rest }: SpinnerProps) {
	return <div {...rest} className={classNames(className, style['spinner'])}>
		<div className={style['circle']} />
		<div className={style['circle']} />
		<div className={style['circle']} />
		<div className={style['circle']} />
		<div className={style['circle']} />
		<div className={style['circle']} />
		<div className={style['circle']} />
		<div className={style['circle']} />
	</div>
}