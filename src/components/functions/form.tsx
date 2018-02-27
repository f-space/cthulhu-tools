import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement>, UpdateEventProps<HTMLFormElement> { }
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, UpdateEventProps<HTMLInputElement> { }
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, UpdateEventProps<HTMLTextAreaElement> { }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, UpdateEventProps<HTMLSelectElement> { }

export interface UpdateEvent<T> extends Event {
	currentTarget: EventTarget & T;
	target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
}

interface UpdateEventProps<T> {
	onUpdate?(event: UpdateEvent<T>): void;
}

interface PropsMap {
	input: InputProps;
	textarea: TextAreaProps;
	select: SelectProps;
}

export const UPDATE_EVENT_TYPE = 'form:update';

export class Form extends React.Component<FormProps> {
	private element: HTMLFormElement | null = null;

	public constructor(props: FormProps, context: any) {
		super(props, context);

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	public componentDidMount(): void {
		if (this.element) this.element.addEventListener(UPDATE_EVENT_TYPE, this.handleUpdate as EventListener);
	}

	public componentWillUnmount(): void {
		if (this.element) this.element.removeEventListener(UPDATE_EVENT_TYPE, this.handleUpdate as EventListener);
	}

	public render() {
		const { onSubmit, onUpdate, ...rest } = this.props;

		return <form {...rest} onSubmit={this.handleSubmit} ref={el => { this.element = el; }} />
	}

	private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		event.stopPropagation();

		if (event.currentTarget.checkValidity()) {
			if (this.props.onSubmit) this.props.onSubmit(event);
		}
	}

	private handleUpdate(event: UpdateEvent<HTMLFormElement>): void {
		if (this.props.onUpdate) this.props.onUpdate(event);
	}
}

export const Input = createFieldComponent('input', "Input");
export const TextArea = createFieldComponent('textarea', "TextArea");
export const Select = createFieldComponent('select', "Select");

function createFieldComponent<T extends keyof PropsMap>(type: T, name: string) {
	type FieldProps = PropsMap[T] & {
		onChange?(event: React.ChangeEvent<FieldElement>): void;
		onUpdate?(event: UpdateEvent<FieldElement>): void;
	};
	type FieldElement = HTMLElementTagNameMap[T];

	return class extends React.Component<FieldProps> {
		public static displayName: string = name;

		private element: FieldElement | null = null;

		public constructor(props: FieldProps, context: any) {
			super(props, context);

			this.handleChange = this.handleChange.bind(this);
			this.handleUpdate = this.handleUpdate.bind(this);
		}

		public componentDidMount(): void {
			if (this.element) this.element.addEventListener(UPDATE_EVENT_TYPE, this.handleUpdate as EventListener);

			this.dispatchUpdateEvent();
		}

		public componentWillUnmount(): void {
			if (this.element) this.element.removeEventListener(UPDATE_EVENT_TYPE, this.handleUpdate as EventListener);
		}

		public render() {
			const { onChange, onUpdate, ...rest } = this.props as any;

			return React.createElement(type, {
				...rest,
				onChange: this.handleChange,
				ref: (el: FieldElement | null) => { this.element = el; }
			});
		}

		private handleChange(event: React.ChangeEvent<FieldElement>): void {
			this.dispatchUpdateEvent();

			if (this.props.onChange) this.props.onChange(event);
		}

		private handleUpdate(event: UpdateEvent<FieldElement>): void {
			if (this.props.onUpdate) this.props.onUpdate(event);
		}

		private dispatchUpdateEvent(): void {
			if (this.element) {
				const event = new Event(UPDATE_EVENT_TYPE, { bubbles: true });
				this.element.dispatchEvent(event);
			}
		}
	}
}