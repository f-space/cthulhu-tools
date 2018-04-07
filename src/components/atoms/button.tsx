import React from 'react';
import classNames from 'classnames';
import style from "styles/atoms/button.scss";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	commit?: boolean;
}

export function Button(props: ButtonProps) {
	const { commit, className, ...rest } = props;

	return <button {...rest} className={classNames(className, style['button'], { [style['commit']]: commit })} type="button" />
}

export function SubmitButton(props: ButtonProps) {
	const { commit, className, ...rest } = props;

	return <button {...rest} className={classNames(className, style['button'], { [style['commit']]: commit })} type="submit" />
}