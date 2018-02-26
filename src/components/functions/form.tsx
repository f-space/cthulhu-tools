import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> { }

export default class Form extends React.Component<FormProps> {
	public constructor(props: FormProps, context: any) {
		super(props, context);

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	public render() {
		return <form {...this.props} onSubmit={this.handleSubmit} />
	}

	private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		event.stopPropagation();

		if (event.currentTarget.checkValidity()) {
			if (this.props.onSubmit) this.props.onSubmit(event);
		}
	}
}