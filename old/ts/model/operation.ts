import { Property, PropertyProvider, PropertyEvaluator, PropertyResolver } from "./property";
import { Character } from "./character";
import { getSHA256 } from "./utility";

type OperationType = 'set<number>' | 'set<text>' | 'add<number>';

interface OperationMap {
	'set<number>': SetNumberOperation;
	'set<text>': SetTextOperation;
	'add<number>': AddNumberOperation;
}

interface OperationDataMap {
	'set<number>': SetNumberOperationData;
	'set<text>': SetTextOperationData;
	'add<number>': AddNumberOperationData;
}

interface Typed<T extends OperationType> {
	type: T;
}

type TypedOperationDataMap = {[T in OperationType]: Typed<T> & OperationDataMap[T]}

export type Operation = OperationMap[OperationType];
export type OperationData = OperationDataMap[OperationType];
export type TypedOperationData<T extends OperationType = OperationType> = TypedOperationDataMap[T];

interface CommonOperationData {
	readonly parent: string | null;
	readonly target: string;
	readonly message?: string;
}

export interface SetNumberOperationData extends CommonOperationData {
	readonly value: number;
}

export interface SetTextOperationData extends CommonOperationData {
	readonly value: string;
}

export interface AddNumberOperationData extends CommonOperationData {
	readonly value: number;
}

export abstract class OperationBase<T extends OperationType> implements Typed<T>, CommonOperationData {
	public readonly parent: string | null;
	public readonly target: string;
	public readonly message: string;
	private _hash: string | undefined;
	public abstract get type(): T;
	public get repr(): string { return `${this.parent}@${this.target} "${this.message}"`; }
	public get hash(): string { return this._hash || (this._hash = getSHA256(this.repr)); }

	public constructor(data: CommonOperationData);
	public constructor(parent: string | null, target: string, message?: string);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as CommonOperationData;

			this.parent = (typeof data.parent === 'string' ? data.parent : null);
			this.target = String(data.target);
			this.message = (data.message !== undefined ? String(data.message) : "");
		} else {
			const parent = args[0] as string | null;
			const target = args[1] as string;
			const message = args[2] as string | undefined;

			this.parent = parent;
			this.target = target;
			this.message = (message !== undefined ? message : "");
		}
	}

	public toJSON(): Typed<T> & CommonOperationData {
		return {
			type: this.type,
			parent: this.parent,
			target: this.target,
			message: this.message || undefined,
		};
	}

	public abstract apply(value: any): any;

	public toString(): string {
		return `${this.hash}: ${this.repr}`;
	}
}

export class SetNumberOperation extends OperationBase<'set<number>'> implements TypedOperationData<'set<number>'> {
	public readonly value: number;
	public get type(): 'set<number>' { return 'set<number>'; }
	public get repr(): string { return `${this.type} ${this.value} # ${super.repr}`; }

	public constructor(data: SetNumberOperationData);
	public constructor(parent: string | null, target: string, value: number, message?: string);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as SetNumberOperationData;

			super(data);
			this.value = Number(data.value);
		} else {
			const parent = args[0] as string | null;
			const target = args[1] as string;
			const value = args[2] as number;
			const message = args[3] as string | undefined;

			super(parent, target, message);
			this.value = value;
		}
	}

	public toJSON(): TypedOperationData<'set<number>'> {
		return Object.assign(super.toJSON(), {
			value: this.value,
		});
	}

	public apply(value: any): number {
		return this.value;
	}
}

export class SetTextOperation extends OperationBase<'set<text>'> implements TypedOperationData<'set<text>'> {
	public readonly value: string;

	public get type(): 'set<text>' { return 'set<text>'; }
	public get repr(): string { return `${this.type} ${this.value} # ${super.repr}`; }

	public constructor(data: SetTextOperationData);
	public constructor(parent: string | null, target: string, value: string, message?: string);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as SetTextOperationData;

			super(data);
			this.value = String(data.value);
		} else {
			const parent = args[0] as string | null;
			const target = args[1] as string;
			const value = args[2] as string;
			const message = args[3] as string | undefined;

			super(parent, target, message);
			this.value = value;
		}
	}

	public toJSON(): TypedOperationData<'set<text>'> {
		return Object.assign(super.toJSON(), {
			value: this.value,
		});
	}

	public apply(value: any): string {
		return this.value;
	}
}

export class AddNumberOperation extends OperationBase<'add<number>'> implements TypedOperationData<'add<number>'> {
	public readonly value: number;
	public get type(): 'add<number>' { return 'add<number>'; }
	public get repr(): string { return `${this.type} ${this.value} # ${super.repr}`; }

	public constructor(data: AddNumberOperationData);
	public constructor(parent: string | null, target: string, value: number, message?: string);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as AddNumberOperationData;

			super(data);
			this.value = Number(data.value);
		} else {
			const parent = args[0] as string | null;
			const target = args[1] as string;
			const value = args[2] as number;
			const message = args[3] as string | undefined;

			super(parent, target, message);
			this.value = value;
		}
	}

	public toJSON(): TypedOperationData<'add<number>'> {
		return Object.assign(super.toJSON(), {
			value: this.value,
		});
	}

	public apply(value: any): number {
		return Number(value) + this.value;
	}
}

export namespace Operation {
	export function from(data: TypedOperationData): Operation {
		switch (data.type) {
			case 'set<number>': return new SetNumberOperation(data);
			case 'set<text>': return new SetTextOperation(data);
			case 'add<number>': return new AddNumberOperation(data);
			default: throw new Error("Invalid opearation type.");
		}
	}
}

type OperationTable = { [hash: string]: Operation; }
type OperationTree = { [hash: string]: string[] | undefined; }

export interface HistoryData {
	readonly head: string | null;
	readonly operations: ReadonlyArray<Operation>;
}

export class History implements Iterable<Operation> {
	private _head: string | null;
	private _operations: Operation[];
	private _table: OperationTable;
	private _tree: OperationTree;

	public get head(): string | null { return this._head; }
	public set head(value: string | null) { this._head = ((value !== null && value in this._table) ? value : null); }
	public get current(): Operation | null { return (this._head !== null ? this._table[this._head] : null); }
	public get operations(): ReadonlyArray<Operation> { return this._operations; }

	public constructor(data?: HistoryData) {
		if (data !== undefined) {
			this._head = data.head;
			this._operations = Array.from(data.operations).map(x => Operation.from(x));
		} else {
			this._head = null;
			this._operations = [];
		}

		this._table = this.makeTable();
		this._tree = this.makeTree();
		this.validate();
	}

	public toJSON(): HistoryData {
		return {
			head: this._head,
			operations: this._operations,
		};
	}

	public contains(hash: string): boolean {
		return (hash in this._table);
	}

	public get(hash: string): Operation | undefined {
		return this._table[hash];
	}

	public add(operation: Operation, transitive?: boolean): void {
		const hash = operation.hash;
		const parent = operation.parent;
		if (!this.contains(hash) && (parent === null || this.contains(parent))) {
			this._operations.push(operation);
			this._table[hash] = operation;
			if (parent !== null) (this._tree[parent] || (this._tree[parent] = [])).push(hash);
			if (transitive === true) this._head = hash;
		}
	}

	public remove(operation: Operation, prune?: boolean): void {
		if (this.contains(operation.hash)) {
			if (prune === true) {
				this.prune(operation.hash);
			} else {
				this.erase(operation.hash);
			}
		}
	}

	public [Symbol.iterator](): Iterator<Operation> {
		return this._operations[Symbol.iterator]();
	}

	private makeTable(): OperationTable {
		const table = Object.create(null) as OperationTable;
		for (const operation of this._operations) {
			table[operation.hash] = operation;
		}
		return table;
	}

	private makeTree(): OperationTree {
		const tree = Object.create(null) as OperationTree;
		for (const operation of this._operations) {
			const parent = operation.parent;
			if (parent !== null) {
				const children = tree[parent] || (tree[parent] = []);

				children.push(operation.hash);
			}
		}
		return tree;
	}

	private validate(): void {
		const roots = this._operations.filter(x => x.parent === null);
		const reachable = Object.assign(Object.create(null), ...roots.map(x => this.reachable(x.hash)));
		if (this._operations.some(x => !reachable[x.hash])) {
			this._operations = this._operations.filter(x => reachable[x.hash]);
			this._table = this.makeTable();
			this._tree = this.makeTree();
		}

		if (this._head !== null && !(this._head in this._table)) {
			this.head = null;
		}
	}

	private traverse(start: string, action: (hash: string) => boolean | void): void {
		const stack = [start];
		while (stack.length !== 0) {
			const current = stack.pop() as string;

			if (!action(current)) {
				const children = this._tree[current];
				if (children) stack.push(...children);
			}
		}
	}

	private reachable(start: string): { [hash: string]: boolean | undefined } {
		const reachable = Object.create(null);
		this.traverse(start, node => {
			const stop = (reachable[node] === false);
			if (!stop) reachable[node] = !reachable[node];
			return stop;
		});

		return reachable;
	}

	private prune(hash: string): void {
		const reachable = this.reachable(hash);

		while (this._head !== null && this._head in reachable) {
			this._head = this._table[this._head].parent;
		}
		this._operations = this._operations.filter(x => !(x.hash in reachable));

		for (const node of Object.keys(reachable)) {
			delete this._table[node];
			delete this._tree[node];
		}
	}

	private erase(hash: string): void {
		const erased = this._table[hash];
		const map = Object.create(null) as { [hash: string]: Operation };

		if (erased.parent !== null) map[erased.parent] = this._table[erased.parent];
		this.traverse(hash, node => {
			if (node !== hash) {
				const operation = this._table[node];;
				const oldParent = (operation.parent !== hash ? operation.parent : erased.parent);
				const newParent = (oldParent !== null ? map[oldParent].hash : null);
				const revised = Operation.from(Object.assign(operation.toJSON(), { parent: newParent }));

				map[node] = revised;
			}
		});

		if (this._head === hash) this._head = erased.parent || null;
		if (this._head !== null && this._head in map) this._head = map[this._head].hash;
		this._operations = this._operations.map(x => x.hash in map ? map[x.hash] : x);
		this._operations.splice(this._operations.findIndex(x => x.hash === hash), 1);

		this._table = this.makeTable();
		this._tree = this.makeTree();
	}
}

type PropertyCache = { [id: string]: any };
type PropertyCacheHistory = { [hash: string]: PropertyCache };

export class HistoryResolver implements PropertyResolver {

	private _cache: PropertyCacheHistory;

	public constructor(readonly provider: PropertyProvider, readonly evaluator: PropertyEvaluator, readonly history: History) {
		this.clear();
	}

	public resolve(id: string, hash: string | null = this.history.head): any {
		const key = (hash !== null ? hash : "@initial");
		const values = (this._cache[key] || (this._cache[key] = Object.create(null)));
		if (!(id in values)) {
			values[id] = undefined;

			const property = this.provider.property(id);
			if (property) {
				if (hash !== null && !property.view) {
					const operation = this.history.get(hash);
					if (operation) {
						const oldValue = this.resolve(id, operation.parent);
						const newValue = (operation.target === id ? operation.apply(oldValue) : oldValue);

						values[id] = newValue;
					}
				} else {
					values[id] = this.evaluateOn(property, hash);
				}
			}
		}

		return values[id];
	}

	public clear(): void {
		this._cache = Object.create(null);
	}

	private evaluateOn(property: Property, hash: string | null): any {
		if (this.evaluator.supports(property)) {
			const resolver = new HistoryResolver.SubResolver(this, hash);
			const evaluated = this.evaluator.evaluate(property, resolver);
			const validated = this.evaluator.validate(property, resolver, evaluated);

			return validated;
		}

		return undefined;
	}

	private static SubResolver = class SubResolver implements PropertyResolver {
		public constructor(readonly parent: HistoryResolver, readonly hash: string | null) { }
		public get provider(): PropertyProvider { return this.parent.provider; }
		public get evaluator(): PropertyEvaluator { return this.parent.evaluator; }
		public resolve(id: string) { return this.parent.resolve(id, this.hash); }
	}
}