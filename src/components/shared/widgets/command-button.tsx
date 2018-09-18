import React from 'react';
import { Field } from 'react-final-form';
import { SubmitButton, ButtonProps } from "./button";

export interface CommandButtonProps extends ButtonProps {
	name: string;
	value: string;
}

export function CommandButton(props: CommandButtonProps) {
	const { name, onClick, ...rest } = props;

	return <Field name={name} subscription={{}} render={({ input }) =>
		<SubmitButton {...rest} onClick={event => {
			input.onChange(event.currentTarget.value);

			if (onClick) onClick(event);
		}} />
	} />
}