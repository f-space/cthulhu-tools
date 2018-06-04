import { Input, Expression, Format } from "./expression";
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
	Expression = 'expression',
	Format = 'format',
}

export interface OperationData {
	readonly type: OperationType;
	readonly target: string;
	readonly value: string;
}

export interface OperationConfig {
	readonly type: OperationType;
	readonly target: string;
	readonly value: Expression | Format;
}

export class Command {
	public readonly parent: string | null;
	public readonly time: number;
	public readonly message: string;
	public readonly operations: ReadonlyArray<Operation>;
	public readonly hash: string;

	public get repr(): string {
		return [
			`@${this.parent || "root"}`,
			...this.operations.map(op => op.repr),
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
			operations: this.operations.length !== 0 ? this.operations.map(operation => operation.toJSON()) : undefined,
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

export class Operation {
	public readonly type: OperationType;
	public readonly target: string;
	public readonly value: Expression | Format;

	public get repr(): string { return `${this.target}:[${this.type}] ${this.value}`; }

	public constructor({ type, target, value }: OperationConfig) {
		this.type = type;
		this.target = target;
		this.value = value;
	}

	public static from({ type, target, value }: OperationData): Operation {
		switch (type) {
			case OperationType.Expression: return new Operation({
				type: OperationType.Expression,
				target: validation.string(target),
				value: validation.expression(value)
			});
			case OperationType.Format: return new Operation({
				type: OperationType.Format,
				target: validation.string(target),
				value: validation.format(value),
			});
			default: throw new Error("Invalid opearation type.");
		}
	}

	public toJSON(): OperationData {
		return {
			type: this.type,
			target: this.target,
			value: this.value.toJSON(),
		};
	}

	public set(config: Partial<OperationConfig>): Operation {
		const { type, target, value } = this;

		return new Operation({ type, target, value, ...config });
	}

	public apply(value: any): any {
		const values = new Map<string, any>([Input.key("_"), value]);

		return this.value.evaluate(values);
	}

	public toString(): string { return this.repr; }
}