import React from 'react';
import classNames from 'classnames';
import { Input, InputProps } from "components/functions/form";
import style from "styles/atoms/input.scss";

export interface NumberInputProps extends InputProps { }
export interface CheckboxProps extends InputProps { }
export interface ToggleProps extends InputProps {
	on: string;
	off: string;
}

export function NumberInput(props: NumberInputProps) {
	const { className, ...rest } = props;

	return <Input {...rest} className={classNames(className, style['input'], style['number'])} type="number" />
}

export function Checkbox(props: CheckboxProps) {
	const { className, ...rest } = props;

	return <Input {...rest} className={classNames(className, style['input'], style['checkbox'])} type="checkbox" />
}

export function Toggle(props: ToggleProps) {
	const { on, off, className, ...rest } = props;

	return <Input {...rest} className={classNames(className, style['input'], style['toggle'])} type="checkbox" data-on={on} data-off={off} />
}