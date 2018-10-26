import React from 'react';
import { Field, FieldProps } from 'react-final-form';
import { NumberInput, NumberInputProps } from "./number-input";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>;
type HTMLTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type HTMLSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

interface FieldCommonProps {
	field?: string | FieldProps;
}

export type NonField<T extends FieldCommonProps> = Omit<T, keyof FieldCommonProps>;

export interface InputProps extends HTMLInputProps, FieldCommonProps { }
export interface TextAreaProps extends HTMLTextAreaProps, FieldCommonProps { }
export interface SelectProps extends HTMLSelectProps, FieldCommonProps { }
export interface NInputProps extends NumberInputProps, FieldCommonProps { }

function isPromise(obj: any): obj is Promise<unknown> {
	return obj !== null && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function normalize(field: string | FieldProps): FieldProps {
	return (typeof field === 'string') ? { name: field } : field;
}

export function Input({ field, ...props }: InputProps) {
	if (field === undefined || props.disabled) {
		return <input {...props} />
	} else {
		return <FieldWrapper {...normalize(field)} {...props} inner="input" />
	}
}

export function TextArea({ field, ...props }: TextAreaProps) {
	if (field === undefined || props.disabled) {
		return <textarea {...props} />
	} else {
		return <FieldWrapper {...normalize(field)} {...props} inner="textarea" />
	}
}

export function Select({ field, ...props }: SelectProps) {
	if (field === undefined || props.disabled) {
		return <select {...props} />
	} else {
		return <FieldWrapper {...normalize(field)} {...props} inner="select" />
	}
}

export function NInput({ field, ...props }: NInputProps) {
	if (field === undefined || props.disabled) {
		return <NumberInput {...props} />
	} else {
		return <FieldWrapper {...normalize(field)} {...props} inner={NumberInput} />
	}
}

interface FieldWrapperProps extends FieldProps {
	inner: 'input' | 'textarea' | 'select' | typeof NumberInput;
}

class FieldWrapper extends React.Component<FieldWrapperProps> {
	private ref: React.RefObject<FieldElement> = React.createRef();

	public constructor(props: FieldWrapperProps) {
		super(props);

		this.validate = this.validate.bind(this);
	}

	public render() {
		const { inner, ...props } = this.props;

		return <Field {...props} subscription={{ value: true }} validate={this.validate} render={({ input, meta, ...rest }) =>
			React.createElement(inner, { ...input, ...rest, ref: this.ref } as any)
		} />
	}

	private validate(): any {
		const { validate } = this.props;

		const element = this.ref.current;
		if (element) {
			element.setCustomValidity("");

			const result = validate && validate.apply(this, arguments);
			return isPromise(result)
				? result.then(setDomValidity.bind(element))
				: setDomValidity(element, result);
		}

		function setDomValidity(element: FieldElement, value: any): string | undefined {
			if (value !== undefined) {
				element.setCustomValidity(value);
			}
			return element.validationMessage || undefined;
		}
	}
}