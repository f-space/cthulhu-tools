import React from 'react';
import PropTypes from 'prop-types';

export interface FormProps<T> {
	initialValues: T;
	onSubmit?(values: T): void;
	render(props: FormRenderProps): React.ReactNode;
}

export interface FormRenderProps {
	ref: React.Ref<HTMLFormElement>;
	onSubmit(event: React.FormEvent<HTMLFormElement>): void;
	onReset(event: React.FormEvent<HTMLFormElement>): void;
}

export interface FieldProps {
	name: string;
	uncontrolled?: boolean;
	render(props: FieldRenderProps): React.ReactNode;
}

export interface FieldRenderProps {
	name: string;
	value?: any;
	onChange(event: React.ChangeEvent<FieldElement>): void;
}

export type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export interface SyncFieldProps {
	name: string;
	value: any;
	onChange(event: SyncFieldChangeEvent): void;
	render(props: SyncFieldRenderProps): React.ReactNode;
}

export interface SyncFieldRenderProps {
	name: string;
	value: any;
	onChange(event: React.ChangeEvent<FieldElement>): void;
}

export interface SyncFieldChangeEvent {
	name: string;
	value: any;
}

export interface ActionProps<T> {
	action(event: ActionEvent<T>): void;
	render(props: ActionRenderProps): React.ReactNode;
}

export interface ActionRenderProps {
	action(event: React.SyntheticEvent<any>): void;
}

export interface ActionEvent<T> extends FormState<T> {
	name?: string;
	command: FormCommand<T>;
}

export interface FormSpyProps<T> {
	dependency?: FormDependency;
	filter?: RegExp;
	onChange?(event: FormChangeEvent<T>): void;
	render?(props: FormSpyRenderProps<T>): React.ReactNode;
}

export interface FormDependency extends Partial<Record<keyof FormState<any>, boolean>> { }

export interface FormChangeEvent<T> extends FormState<T> {
	name?: string;
}

export interface FormSpyRenderProps<T> extends FormState<T> { }

export interface FormCommand<T> {
	change(name: string, value: any): void;
	reset(values?: T): void;
}

interface FormState<T> {
	values: T;
	valid: boolean;
}

interface FormContext<T> {
	readonly initialValues: T;
	readonly values: T;
	readonly valid: boolean;
	subscribe(subscriber: FormSubscriber): FormUnsubscribe;
	getValue(name: string): any;
	setInitialValues(values: T): void;
	setValue(name: string, value: any): void;
	setValid(value: boolean): void;
	reset(values?: T): void;
}

type FormSubscriber = (event: FormContextChangeEvent) => void;
type FormUnsubscribe = () => void;

interface FormContextChangeEvent {
	target: keyof FormDependency;
	name?: string;
}

const contextTypes = { form: PropTypes.any.isRequired };

function getFieldValue(element: FieldElement): any {
	const type = element.type;

	let input, select;
	switch (type) {
		case 'select-multiple':
			select = element as HTMLSelectElement;
			return Array.from(select.selectedOptions).map(opt => opt.value);
		case 'checkbox':
		case 'radio':
			input = element as HTMLInputElement;
			return input.checked ? input.value : undefined;
		case 'file':
			input = element as HTMLInputElement;
			return input.files;
		case 'button':
		case 'submit':
		case 'image':
			break;
		default:
			return element.value;
	}

	return undefined;
}

class FormContextImpl<T> implements FormContext<T>{
	public initialValues: T;
	public values: T;
	public valid: boolean;
	private subscribers = new Set<FormSubscriber>();

	public constructor(initialValues: T) {
		this.initialValues = initialValues;
		this.values = initialValues;
		this.valid = false;
	}

	public subscribe(subscriber: FormSubscriber): FormUnsubscribe {
		this.subscribers.add(subscriber);
		return () => { this.subscribers.delete(subscriber); };
	}

	public getValue(name: string): any {
		const values = this.values as any;
		const segments = name.split(".");
		return segments.reduce((v, seg) => v !== undefined ? v[seg] : undefined, values);
	}

	public setInitialValues(values: T): void {
		this.initialValues = values;
	}

	public setValue(name: string, value: any): void {
		const values = this.values as any;
		const segments = name.split(".");
		const leaf = segments.pop() as string;
		const obj = segments.reduce((v, seg) => v[seg] || (v[seg] = {}), values);

		if (obj[leaf] !== value) {
			obj[leaf] = value;
			this.publish({ target: 'values', name });
		}
	}

	public setValid(value: boolean): void {
		if (this.valid !== value) {
			this.valid = value;
			this.publish({ target: 'valid' });
		}
	}

	public reset(values: T = this.initialValues): void {
		if (this.values !== values) {
			this.values = values;
			this.publish({ target: 'values' });
		}
	}

	private publish(event: FormContextChangeEvent): void {
		for (const subscriber of this.subscribers) {
			subscriber(event);
		}
	}
}

export class Form<T> extends React.Component<FormProps<T>> {
	public static childContextTypes = contextTypes;

	private formContext: FormContextImpl<T>;
	private element: HTMLFormElement | null = null;
	private unsubscribe?: FormUnsubscribe;

	public constructor(props: FormProps<T>, context: any) {
		super(props, context);

		this.formContext = new FormContextImpl(props.initialValues);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
	}

	public getChildContext() {
		return { form: this.formContext };
	}

	public componentDidMount(): void {
		this.unsubscribe = this.formContext.subscribe(this.handleFormChange);

		this.updateValidity();
	}

	public componentWillUnmount(): void {
		if (this.unsubscribe) this.unsubscribe();
	}

	public componentWillReceiveProps(nextProps: FormProps<T>): void {
		this.updateInitialValues(nextProps);
	}

	public render() {
		return this.props.render({
			ref: el => { this.element = el; },
			onSubmit: this.handleSubmit,
			onReset: this.handleReset,
		});
	}

	private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		event.stopPropagation();

		const { onSubmit } = this.props;
		const { values, valid } = this.formContext;
		if (valid && onSubmit) onSubmit(values);
	}

	private handleReset(event: React.FormEvent<HTMLFormElement>): void {
		event.preventDefault();
		event.stopPropagation();

		this.formContext.reset();
	}

	private handleFormChange({ target }: FormContextChangeEvent): void {
		if (target === "values") this.updateValidity();
	}

	private updateInitialValues(nextProps: FormProps<T>) {
		this.formContext.setInitialValues(nextProps.initialValues);
	}

	private updateValidity(): void {
		if (this.element) {
			const valid = this.element.checkValidity();

			this.formContext.setValid(valid);
		}
	}
}

export class Field extends React.Component<FieldProps>{
	public static contextTypes = contextTypes;

	private unsubscribe?: FormUnsubscribe;

	private get formContext(): FormContext<any> { return this.context.form; }

	public constructor(props: FieldProps, context: any) {
		super(props, context);

		this.handleChange = this.handleChange.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
	}

	public componentDidMount(): void {
		this.unsubscribe = this.formContext.subscribe(this.handleFormChange);
	}

	public componentWillUnmount(): void {
		if (this.unsubscribe) this.unsubscribe();
	}

	public render() {
		const { name, uncontrolled } = this.props;
		const value = this.formContext.getValue(name);

		return this.props.render(Object.assign({
			name,
			onChange: this.handleChange,
		}, uncontrolled ? undefined : { value }));
	}

	private handleChange(event: React.ChangeEvent<FieldElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const value = getFieldValue(target);

		this.formContext.setValue(name, value);
	}

	private handleFormChange({ target, name }: FormContextChangeEvent): void {
		if (target === "values" && (!name || name === this.props.name)) {
			this.forceUpdate();
		}
	}
}

export class SyncField extends React.Component<SyncFieldProps>{
	public constructor(props: SyncFieldProps, context: any) {
		super(props, context);

		this.handleChange = this.handleChange.bind(this);
	}

	public render() {
		const { name, value } = this.props;

		return this.props.render({
			name,
			value,
			onChange: this.handleChange,
		});
	}

	private handleChange(event: React.ChangeEvent<FieldElement>): void {
		const target = event.currentTarget;
		const name = target.name;
		const value = getFieldValue(target);

		this.props.onChange({ name, value });
	}
}

export class Action<T> extends React.Component<ActionProps<T>> {
	public static contextTypes = contextTypes;

	private command: FormCommand<T> = {
		change: this.change.bind(this),
		reset: this.reset.bind(this),
	};

	private get formContext(): FormContext<T> { return this.context.form; }

	public constructor(props: ActionProps<T>, context: any) {
		super(props, context);

		this.handleEvent = this.handleEvent.bind(this);
	}

	public render() {
		return this.props.render({ action: this.handleEvent });
	}

	private handleEvent(event: React.SyntheticEvent<any>): void {
		const target = event.currentTarget;
		const name = target.name;
		const command = this.command;
		const { values, valid } = this.formContext;

		this.props.action({ name, command, values, valid });
	}

	private change(name: string, value: any): void {
		this.formContext.setValue(name, value);
	}

	private reset(values?: T): void {
		this.formContext.reset(values);
	}
}

export class FormSpy<T> extends React.Component<FormSpyProps<T>> {
	public static contextTypes = contextTypes;

	private unsubscribe?: FormUnsubscribe;

	private get formContext(): FormContext<T> { return this.context.form; }

	public constructor(props: FormSpyProps<T>, context: any) {
		super(props, context);

		this.handleFormChange = this.handleFormChange.bind(this);
	}

	public componentDidMount(): void {
		this.unsubscribe = this.formContext.subscribe(this.handleFormChange);
	}

	public componentWillUnmount(): void {
		if (this.unsubscribe) this.unsubscribe();
	}

	public render() {
		const { render } = this.props;
		const { values, valid } = this.formContext;

		return render ? render({ values, valid }) : null;
	}

	private handleFormChange({ target, name }: FormContextChangeEvent): void {
		const { dependency, filter, onChange, render } = this.props;
		if (!dependency || dependency[target]) {
			if (!name || !filter || filter.test(name)) {
				if (onChange) {
					const { values, valid } = this.formContext;
					onChange({ name, values, valid });
				}

				if (render) this.forceUpdate();
			}
		}
	}
}