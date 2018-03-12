import React from 'react';
import classNames from 'classnames';
import style from "styles/atoms/input.scss";

export interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { }
export interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
	on: string;
	off: string;
}

export function NumberInput({ className, ...rest }: NumberInputProps) {
	return <input {...rest} className={classNames(className, style['input'], style['number'])} type="number" />
}

export function Checkbox({ className, ...rest }: CheckboxProps) {
	return <input {...rest} className={classNames(className, style['input'], style['checkbox'])} type="checkbox" />
}

export function Toggle({ on, off, className, ...rest }: ToggleProps) {
	return <input {...rest} className={classNames(className, style['input'], style['toggle'])} type="checkbox" data-on={on} data-off={off} />
}