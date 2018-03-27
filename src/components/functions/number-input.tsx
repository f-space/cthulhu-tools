import React from 'react';

export interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	type?: 'number';
	value?: number;
	refDOM?: React.Ref<HTMLInputElement>;
	onChange?(value: React.ChangeEvent<HTMLInputElement> | number): void;
}

export interface NumberInputState {
	value?: string;
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
	public constructor(props: NumberInputProps, context: any) {
		super(props, context);

		this.state = { value: this.format(props.value) };
		this.handleChange = this.handleChange.bind(this);
	}

	public componentWillReceiveProps(nextProps: NumberInputProps): void {
		if (!this.eq(this.props.value, nextProps.value)) {
			if (!this.eq(nextProps.value, this.parse(this.state.value))) {
				this.setState({ value: this.format(nextProps.value) });
			}
		}
	}

	public render() {
		const { refDOM, onChange, ...props } = this.props;
		const { value } = this.state;
		const handleChange = onChange && this.handleChange;

		return <input {...props} type="number" value={value} ref={refDOM} onChange={handleChange} />
	}

	private handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const { name, value } = event.currentTarget;

		this.setState({ value }, () => {
			this.props.onChange!(value ? Number(value) : NaN);
		});
	}

	private eq(x: number | undefined, y: number | undefined): boolean {
		return (x === y || (Number.isNaN(x as number) && Number.isNaN(y as number)));
	}

	private parse(x: string | undefined): number | undefined {
		return x !== undefined ? (x !== "" ? Number(x) : NaN) : undefined;
	}

	private format(x: number | undefined): string | undefined {
		return x !== undefined ? (!Number.isNaN(x) ? String(x) : "") : undefined;
	}
}