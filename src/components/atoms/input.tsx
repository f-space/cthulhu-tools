import React from 'react';
import classNames from 'classnames';
import { Input, InputProps } from "components/functions/form";
import style from "styles/atoms/input.scss";

export interface NumberInputProps extends InputProps { }
export interface CheckboxProps extends InputProps { }

export function NumberInput(props: NumberInputProps) {
	const { className, ...rest } = props;

	return <Input {...rest} className={classNames(className, style['input'], style['number'])} type="number" />
}

export function Checkbox(props: CheckboxProps) {
	const { className, ...rest } = props;

	return <Input {...rest} className={classNames(className, style['input'], style['checkbox'])} type="checkbox" />
}
