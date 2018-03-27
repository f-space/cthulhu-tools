import React from 'react';
import classNames from 'classnames';
import { Input, InputProps, NInput, NInputProps } from "components/functions/field";
import style from "styles/atoms/input.scss";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface TextInputProps extends InputProps { }
export interface NumberInputProps extends NInputProps { }
export interface CheckboxProps extends Omit<InputProps, 'type'> { }
export interface ToggleProps extends Omit<InputProps, 'type'> {
	on: string;
	off: string;
}

export function TextInput({ className, ...rest }: TextInputProps) {
	return <Input {...rest} className={classNames(className, style['input'])} />
}

export function NumberInput({ className, ...rest }: NumberInputProps) {
	return <NInput {...rest} className={classNames(className, style['input'], style['number'])} />
}

export function Checkbox({ className, ...rest }: CheckboxProps) {
	return <Input {...rest} className={classNames(className, style['input'], style['checkbox'])} type="checkbox" />
}

export function Toggle({ on, off, className, ...rest }: ToggleProps) {
	return <Input {...rest} className={classNames(className, style['input'], style['toggle'])} type="checkbox" data-on={on} data-off={off} />
}