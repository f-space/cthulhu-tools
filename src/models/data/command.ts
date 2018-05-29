import { sha256 } from "./hash";
import * as validation from "./validation";

export interface CommandData {
	readonly parent?: string | null;
	readonly time?: number;
	readonly message?: string;
	readonly operations?: ReadonlyArray<OperationData>;
}

export interface CommandConfig {
	readonly parent: string | null;
	readonly time: number;
	readonly message?: string;
	readonly operations?: ReadonlyArray<Operation>;
}

export enum OperationType {
	Set = 'set',
	Add = 'add',
}

export type OperationData = SetOperationData | AddOperationData;
export type Operation = SetOperation | AddOperation;

interface OperationCommonData<T extends OperationType> {
	readonly type: T;
	readonly target: string;
}

export interface SetOperationData extends OperationCommonData<OperationType.Set> {
	readonly value: number | string;
}

export interface AddOperationData extends OperationCommonData<OperationType.Add> {
	readonly value: number;
}

interface OperationCommonConfig {
	readonly target: string;
}

export interface SetOperationConfig extends OperationCommonConfig {
	readonly value: number | string;
}

export interface AddOperationConfig extends OperationCommonConfig {
	readonly value: number;
}

export class Command {
	public readonly parent: string | null;
	public readonly time: number;
	public readonly message: string;
	public readonly operations: ReadonlyArray<Operation>;
	public readonly hash: string;

	public get repr(): string {
		return [
			`@${this.parent || "root"} ~${this.time}`,
			...this.operations.map(op => op.repr),
			this.message,
		].join("\n");
	}

	public constructor({ parent, time, message, operations }: CommandConfig) {
		this.parent = parent;
		this.time = time;
		this.message = message !== undefined ? message : "";
		this.operations = operations !== undefined ? operations : [];
		this.hash = sha256(this.repr);
	}

	public static from({ parent, time, message, operations }: CommandData): Command {
		return new Command({
			parent: validation.string_null(parent),
			time: validation.time(time),
			message: validation.string(validation.or(message, "")),
			operations: validation.array(operations, Operation.from),
		});
	}

	public toJSON(): CommandData {
		return {
			parent: this.parent,
			time: this.time,
			message: this.message || undefined,
			operations: this.operations.length !== 0 ? this.operations : undefined,
		};
	}

	public set(config: Partial<CommandConfig>): Command {
		const { parent, time, message, operations } = this;

		return new Command({ parent, time, message, operations, ...config });
	}

	public toString(): string {
		return `#${this.hash.slice(0, 8)}: ${this.message.split("\n", 1).pop()}`;
	}
}

abstract class OperationBase<T extends OperationType> {
	public readonly target: string;

	public abstract get type(): T;

	public get repr(): string { return `$${this.type}[${this.target}]`; }

	public constructor({ target }: OperationCommonConfig) {
		this.target = target;
	}

	public toJSON(): OperationCommonData<T> {
		return {
			type: this.type,
			target: this.target,
		};
	}

	public abstract apply(value: any): any;

	public toString(): string { return this.repr; }

	protected static import({ target }: OperationCommonData<OperationType>): OperationCommonConfig {
		return { target: validation.string(target) };
	}

	protected config(): OperationCommonConfig {
		const { target } = this;

		return { target };
	}
}

export class SetOperation extends OperationBase<OperationType.Set> {
	public readonly value: number | string;

	public get type(): OperationType.Set { return OperationType.Set; }

	public get repr(): string { return `${super.repr} ${JSON.stringify(this.value)}`; }

	public constructor({ value, ...rest }: SetOperationConfig) {
		super(rest);
		this.value = value;
	}

	public static from(data: SetOperationData): SetOperation {
		return new SetOperation(this.import(data));
	}

	public toJSON(): SetOperationData {
		return Object.assign(super.toJSON(), {
			value: this.value,
		});
	}

	public set(config: Partial<SetOperationConfig>): SetOperation {
		return new SetOperation(Object.assign(this.config(), config));
	}

	public apply(value: any): number | string {
		return this.value;
	}

	protected static import({ value, ...rest }: SetOperationData): SetOperationConfig {
		return Object.assign(OperationBase.import(rest), {
			value: validation.or(validation.number_string(value), String(undefined)),
		});
	}

	protected config(): SetOperationConfig {
		const { value } = this;

		return Object.assign(super.config(), { value });
	}
}

export class AddOperation extends OperationBase<OperationType.Add> {
	public readonly value: number;

	public get type(): OperationType.Add { return OperationType.Add; }

	public get repr(): string { return `${super.repr} ${JSON.stringify(this.value)}`; }

	public constructor({ value, ...rest }: AddOperationConfig) {
		super(rest);
		this.value = value;
	}

	public static from(data: AddOperationData): AddOperation {
		return new AddOperation(this.import(data));
	}

	public toJSON(): AddOperationData {
		return Object.assign(super.toJSON(), {
			value: this.value,
		});
	}

	public set(config: Partial<AddOperationConfig>): AddOperation {
		return new AddOperation(Object.assign(this.config(), config));
	}

	public apply(value: any): number {
		return Number(value) + this.value;
	}

	protected static import({ value, ...rest }: AddOperationData): AddOperationConfig {
		return Object.assign(OperationBase.import(rest), {
			value: validation.number(value),
		});
	}

	protected config(): AddOperationConfig {
		const { value } = this;

		return Object.assign(super.config(), { value });
	}
}

export namespace Operation {
	export function from(data: any): Operation {
		switch (data.type) {
			case OperationType.Set: return SetOperation.from(data);
			case OperationType.Add: return AddOperation.from(data);
			default: throw new Error("Invalid opearation type.");
		}
	}
}