import * as validation from "models/validation";
import { getSHA256 } from "models/utility";

export interface CommandData {
	readonly parent?: string | null;
	readonly time?: number;
	readonly message?: string;
	readonly operations: ReadonlyArray<OperationData>;
}

type OperationType = 'set' | 'add';

interface OperationDataMap {
	'set': SetOperationData;
	'add': AddOperationData;
}

interface OperationMap {
	'set': SetOperation;
	'add': AddOperation;
}

export type OperationData = OperationDataMap[OperationType];
export type Operation = OperationMap[OperationType];

interface OperationDataBase<T extends OperationType> {
	readonly type: T;
	readonly target: string;
}

export interface SetOperationData extends OperationDataBase<'set'> {
	readonly value: number | string;
}

export interface AddOperationData extends OperationDataBase<'add'> {
	readonly value: number;
}

export class Command implements CommandData {
	public readonly parent: string | null;
	public readonly time: number;
	public readonly message: string;
	public readonly operations: Operation[];
	public readonly hash: string;

	public get repr(): string {
		return [
			`@${this.parent || "root"} ~${this.time}`,
			...this.operations.map(op => op.repr),
			this.message,
		].join("\n");
	}

	public constructor({ parent, time, message, operations }: CommandData) {
		this.parent = validation.string_null(parent);
		this.time = validation.time(time);
		this.message = validation.string(validation.or(message, ""));
		this.operations = validation.array(operations, Operation.from);
		this.hash = getSHA256(this.repr);
	}

	public toJSON(): CommandData {
		return {
			parent: this.parent,
			time: this.time,
			message: this.message || undefined,
			operations: this.operations,
		};
	}

	public toString(): string {
		return `#${this.hash.slice(0, 8)}: ${this.message.split("\n", 1).pop()}`;
	}
}

abstract class OperationBase<T extends OperationType> implements OperationDataBase<T> {
	public readonly type: T;
	public readonly target: string;

	public get repr(): string { return `$${this.type}[${this.target}]`; }

	public constructor({ type, target }: OperationDataBase<T>) {
		this.type = validation.string_literal(type);
		this.target = validation.string(target);
	}

	public toJSON(): OperationDataBase<T> {
		return {
			type: this.type,
			target: this.target,
		};
	}

	public abstract apply(value: any): any;

	public toString(): string { return this.repr; }
}

export class SetOperation extends OperationBase<'set'> implements SetOperationData {
	public readonly value: number | string;

	public get repr(): string { return `${super.repr} ${JSON.stringify(this.value)}`; }

	public constructor({ value, ...rest }: SetOperationData) {
		super(rest);
		this.value = validation.or(validation.number_string(value), String(undefined));
	}

	public toJSON(): SetOperationData {
		return Object.assign(super.toJSON(), {
			value: this.value,
		});
	}

	public apply(value: any): number | string {
		return this.value;
	}
}

export class AddOperation extends OperationBase<'add'> implements AddOperationData {
	public readonly value: number;

	public get repr(): string { return `${super.repr} ${JSON.stringify(this.value)}`; }

	public constructor({ value, ...rest }: AddOperationData) {
		super(rest);
		this.value = validation.number(value);
	}

	public toJSON(): AddOperationData {
		return Object.assign(super.toJSON(), {
			value: this.value,
		});
	}

	public apply(value: any): number {
		return Number(value) + this.value;
	}
}

export namespace Operation {
	export function from(data: any): Operation {
		switch (data.type) {
			case 'set': return new SetOperation(data);
			case 'add': return new AddOperation(data);
			default: throw new Error("Invalid opearation type.");
		}
	}
}