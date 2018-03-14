import React from 'react';

type Diff<T extends string, U extends string> = ({[P in T]: P} & {[P in U]: never} & Record<string, never>)[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface FieldChangeEvent<T> {
	name: string;
	value: T;
}

export interface InputFieldProps extends Omit<InputProps, 'onChange'> {
	onChange?(event: FieldChangeEvent<string>): void;
}

export interface NumberFieldProps extends Omit<InputProps, 'value' | 'onChange'> {
	value?: number;
	uncontrolled?: boolean;
	onChange?(event: FieldChangeEvent<number>): void;
}

export interface CheckFieldProps extends Omit<InputProps, 'value' | 'checked' | 'onChange'> {
	value?: boolean;
	uncontrolled?: boolean;
	onChange?(event: FieldChangeEvent<boolean>): void;
}

export class InputField extends React.Component<InputFieldProps>{
	public constructor(props: InputFieldProps, context: any) {
		super(props, context);

		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { onChange, ...rest } = this.props;

		return <input {...rest} onChange={onChange && this.handleChange} />
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const value = target.value;

		const { onChange } = this.props;
		if (onChange) onChange({ name, value });
	}
}

export class NumberField extends React.Component<NumberFieldProps, { value: string }>{
	private element: HTMLInputElement | null = null;

	public constructor(props: NumberFieldProps, context: any) {
		super(props, context);

		this.state = { value: this.format(props.value) };
		this.handleChange = this.handleChange.bind(this);
	}

	public componentWillReceiveProps(nextProps: NumberFieldProps): void {
		if (this.props.value !== nextProps.value) {
			const prevValue = this.parse(this.state.value);
			const nextValue = nextProps.value;
			if (prevValue !== nextValue) {
				this.setState({ value: this.format(nextValue) });
			}
		}
	}

	public render() {
		const { value: _, uncontrolled, onChange, ...rest } = this.props;
		const value = uncontrolled ? undefined : this.state.value;

		return <input {...rest} type="number" value={value} onChange={onChange && this.handleChange} ref={el => { this.element = el; }} />
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const value = target.value;

		this.setState({ value }, () => {
			const { onChange } = this.props;
			if (onChange) onChange({ name, value: this.parse(value) });
		});
	}

	private format(value?: number): string {
		return value !== undefined && !Number.isNaN(value) ? String(value) : "";
	}

	private parse(value?: string): number {
		return value !== undefined && value !== "" ? Number(value) : NaN;
	}
}

export class CheckField extends React.Component<CheckFieldProps> {
	public constructor(props: CheckFieldProps, context: any) {
		super(props, context);

		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { value, uncontrolled, onChange, ...rest } = this.props;
		const checked = uncontrolled ? undefined : Boolean(value);

		return <input {...rest} type="checkbox" checked={checked} onChange={onChange && this.handleChange} />
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const value = target.checked;

		const { onChange } = this.props;
		if (onChange) onChange({ name, value });
	}
}