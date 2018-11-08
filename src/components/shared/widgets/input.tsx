import React from 'react';
import classNames from 'classnames';
import { Input, InputProps, NInput, NInputProps } from "../primitives/field";
import style from "./input.scss";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface TextInputProps extends InputProps { }
export interface NumberInputProps extends NInputProps { }
export interface CheckboxProps extends Omit<InputProps, 'type'> { }
export interface ToggleProps extends Omit<InputProps, 'type'> {
	on: string;
	off: string;
}
export interface RadioProps extends Omit<InputProps, 'type'> { }

export function TextInput({ className, ...rest }: TextInputProps) {
	return <Input {...rest} className={classNames(className, style['input'])} />
}

export function NumberInput({ className, ...rest }: NumberInputProps) {
	return <NInput {...rest} className={classNames(className, style['input'], style['number'])} />
}

export function Checkbox({ className, ...rest }: CheckboxProps) {
	return <label className={classNames(className, style['checkbox'])}>
		<Input {...rest} className={style['invisible']} type="checkbox" />
		<span className={style['checkbox-content']} />
	</label>
}

export function Toggle({ on, off, className, ...rest }: ToggleProps) {
	return <label className={classNames(className, style['toggle'])} >
		<Input {...rest} className={style['invisible']} type="checkbox" />
		<span className={style['toggle-content']} data-on={on} data-off={off} />
	</label>
}

export function Radio({ className, ...rest }: RadioProps) {
	return <label className={classNames(className, style['radio'])}>
		<Input {...rest} className={style['invisible']} type="radio" />
		<span className={style['radio-content']} />
	</label>
}