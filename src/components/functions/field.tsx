import React from 'react';
import { Field, FieldProps } from 'react-final-form';
import { NumberInput, NumberInputProps } from "components/functions/number-input";

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

function normalize(field: string | FieldProps): FieldProps {
	return (typeof field === 'string') ? { name: field } : field;
}

export function Input({ field, ...props }: InputProps) {
	if (field === undefined) {
		return <input {...props} />
	} else {
		return <FieldWrapper {...normalize(field)} {...props} inner="input" />
	}
}

export function TextArea({ field, ...props }: TextAreaProps) {
	if (field === undefined) {
		return <textarea {...props} />
	} else {
		return <FieldWrapper {...normalize(field)} {...props} inner="textarea" />
	}
}

export function Select({ field, ...props }: SelectProps) {
	if (field === undefined) {
		return <select {...props} />
	} else {
		return <FieldWrapper {...normalize(field)} {...props} inner="select" />
	}
}

export function NInput({ field, ...props }: NInputProps) {
	if (field === undefined) {
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

	public constructor(props: FieldWrapperProps, context: any) {
		super(props, context);

		this.validate = this.validate.bind(this);
	}

	public componentDidMount(): void {
		this.forceUpdate();
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

		return (element && element.validationMessage) || (validate && validate.apply(this, arguments));
	}
}