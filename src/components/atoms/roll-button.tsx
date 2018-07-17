import React from 'react';
import classNames from 'classnames';
import style from "styles/atoms/roll-button.scss";

export interface RollButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export function RollButton({ className, ...rest }: RollButtonProps) {
	return <button {...rest} className={classNames(className, style['button'])}>
		Roll
	</button>
}