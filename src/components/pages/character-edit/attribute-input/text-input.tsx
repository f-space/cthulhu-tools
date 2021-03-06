import React from 'react';
import { TextInputMethod } from "models/status";
import { NonField } from "components/shared/primitives/field"
import { TextInput, TextInputProps } from "components/shared/widgets/input";
import style from "./index.scss";

export interface AttributeTextInputProps extends NonField<TextInputProps> {
	name: string;
	method: TextInputMethod;
}

export function AttributeTextInput(props: AttributeTextInputProps) {
	const { name, method, ...rest } = props;

	return <TextInput {...rest} className={style['text']} field={name} autoComplete="off" />
}