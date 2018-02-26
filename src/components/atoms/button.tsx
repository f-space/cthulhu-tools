import React from 'react';
import classNames from 'classnames';
import style from "styles/atoms/button.scss";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	commit?: boolean;
}

export default function Button(props: ButtonProps) {
	const { type = "button", commit, className, ...rest } = props;

	return <button {...rest} className={classNames(className, style['button'], { [style['commit']]: commit })} type={type} />
}