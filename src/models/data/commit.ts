import { Hash } from "./hash";
import { Variable, Expression } from "./expression";
import { validate } from "./validation";

export interface CommitData {
	readonly parent: string | null;
	readonly time: number;
	readonly message?: string;
	readonly operations?: ReadonlyArray<OperationData>;
}

export interface CommitConfig {
	readonly parent: string | null;
	readonly time: number;
	readonly message?: string;
	readonly operations?: ReadonlyArray<Operation>;
}

export interface OperationData {
	readonly target: string;
	readonly value: string;
}

export interface OperationConfig {
	readonly target: string;
	readonly value: Expression;
}

export class Commit implements CommitConfig {
	public readonly parent: string | null;
	public readonly time: number;
	public readonly message: string;
	public readonly operations: ReadonlyArray<Operation>;

	public get repr(): string {
		return [
			`#${this.parent || "root"}`,
			...this.operations.map(op => op.repr),
		].join("\n");
	}

	public get hash(): string { return Hash.get(this, commit => commit.repr).hex; }

	public constructor({ parent, time, message, operations }: CommitConfig) {
		this.parent = parent;
		this.time = time;
		this.message = message !== undefined ? message : "";
		this.operations = operations !== undefined ? operations : [];
	}

	public static from({ parent, time, message, operations }: CommitData): Commit {
		return new Commit({
			parent: validate("parent", parent).nullable(v => v.string()).value,
			time: validate("time", time).time().value,
			message: validate("message", message).optional(v => v.string()).value,
			operations: validate("operations", operations).optional(v => v.array(v => v.object<OperationData>().map(Operation.from))).value,
		});
	}

	public toJSON(): CommitData {
		return {
			parent: this.parent,
			time: this.time,
			message: this.message || undefined,
			operations: this.operations.length !== 0 ? this.operations.map(operation => operation.toJSON()) : undefined,
		};
	}

	public set(config: Partial<CommitConfig>): Commit {
		const { parent, time, message, operations } = this;

		return new Commit({ parent, time, message, operations, ...config });
	}

	public toString(): string {
		return `#${this.hash.slice(0, 8)}: ${this.message.split("\n", 1).pop()}`;
	}
}

export class Operation implements OperationConfig {
	public readonly target: string;
	public readonly value: Expression;

	public get repr(): string { return `<${this.target}>${this.value}`; }

	public constructor({ target, value }: OperationConfig) {
		this.target = target;
		this.value = value;
	}

	public static from({ target, value }: OperationData): Operation {
		return new Operation({
			target: validate("target", target).string().ref().value,
			value: validate("value", value).string().expr().value,
		});
	}

	public toJSON(): OperationData {
		return {
			target: this.target,
			value: this.value.toJSON(),
		};
	}

	public set(config: Partial<OperationConfig>): Operation {
		const { target, value } = this;

		return new Operation({ target, value, ...config });
	}

	public apply(value: any): any {
		const values = new Map<string, any>([[Variable.key("_"), value]]);

		return this.value.evaluate(values);
	}

	public toString(): string { return this.repr; }
}