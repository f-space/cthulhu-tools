import React from 'react';
import { NumberInputMethod } from "models/status";
import { NonField } from "components/functions/field"
import { NumberInput, NumberInputProps } from "components/atoms/input";
import style from "styles/molecules/attribute-number-input.scss";

export interface AttributeNumberInputProps extends NonField<NumberInputProps> {
	name: string;
	method: NumberInputMethod;
}

export default function AttributeNumberInput(props: AttributeNumberInputProps) {
	const { name, method, ...rest } = props;
	const { min, max, step } = method;

	return <NumberInput {...rest} field={name} required min={min} max={max} step={step} />
}