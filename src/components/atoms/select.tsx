import React from 'react';
import classNames from 'classnames';
import { Select as Base, SelectProps as BaseProps } from "components/functions/field";
import style from "styles/atoms/select.scss";

export interface SelectProps extends BaseProps { }

export function Select({ className, ...rest }: SelectProps) {
	return <Base {...rest} className={classNames(className, style['select'])} />
}