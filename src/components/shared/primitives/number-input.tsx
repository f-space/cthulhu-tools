import React from 'react';

export interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	type?: 'number';
	value?: number;
	onChange?(value: React.ChangeEvent<HTMLInputElement> | number): void;
}

interface NumberInputState {
	props: NumberInputProps;
	value?: string;
}

export const NumberInput = React.forwardRef(
	function NumberInput(props: NumberInputProps, ref?: React.Ref<HTMLInputElement>) {
		return <NumberInputInternal {...props} refDOM={ref} />
	}
);

interface NumberInputInternalProps extends NumberInputProps {
	refDOM?: React.Ref<HTMLInputElement>;
}

class NumberInputInternal extends React.Component<NumberInputInternalProps, NumberInputState> {
	public constructor(props: NumberInputInternalProps) {
		super(props);

		this.state = { props, value: format(props.value) };
		this.handleChange = this.handleChange.bind(this);
	}

	static getDerivedStateFromProps(nextProps: NumberInputInternalProps, prevState: NumberInputState): Partial<NumberInputState> | null {
		if (!eq(prevState.props.value, nextProps.value)) {
			if (!eq(nextProps.value, parse(prevState.value))) {
				return { props: nextProps, value: format(nextProps.value) };
			}
		}
		return { props: nextProps };
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
			this.props.onChange!(parse(value)!);
		});
	}
}

function eq(x: number | undefined, y: number | undefined): boolean {
	return (x === y || (Number.isNaN(x as number) && Number.isNaN(y as number)));
}

function parse(x: string | undefined): number | undefined {
	return x !== undefined ? (x !== "" ? Number(x) : NaN) : undefined;
}

function format(x: number | undefined): string | undefined {
	return x !== undefined ? (!Number.isNaN(x) ? String(x) : "") : undefined;
}