import React from 'react';
import classNames from 'classnames';
import { NumberField, CheckField, NumberFieldProps, CheckFieldProps } from "components/functions/field";
import style from "styles/atoms/input.scss";

export interface NumberInputProps extends NumberFieldProps { }
export interface CheckboxProps extends CheckFieldProps { }
export interface ToggleProps extends CheckFieldProps {
	on: string;
	off: string;
}

export function NumberInput({ className, ...rest }: NumberInputProps) {
	return <NumberField {...rest} className={classNames(className, style['input'], style['number'])} />
}

export function Checkbox({ className, ...rest }: CheckboxProps) {
	return <CheckField {...rest} className={classNames(className, style['input'], style['checkbox'])} />
}

export function Toggle({ on, off, className, ...rest }: ToggleProps) {
	return <CheckField {...rest} className={classNames(className, style['input'], style['toggle'])} data-on={on} data-off={off} />
}