import React from 'react';
import classNames from 'classnames';
import style from "styles/atoms/input.scss";

export interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function NumberInput(props: NumberInputProps) {
	const { className, ...rest } = props;

	return <input {...rest} className={classNames(className, style['input'], style['number'])} type="number" />
}