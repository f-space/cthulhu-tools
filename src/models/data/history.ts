import { CommandData, Command } from "./command";
import * as validation from "./validation";

type BranchTable = { [name: string]: string | null };
type CommandDataMap = { [hash: string]: CommandData };
type CommandMap = { [hash: string]: Command };

export interface HistoryData {
	readonly uuid?: string;
	readonly name: string;
	readonly active?: string | null;
	readonly branches?: Readonly<BranchTable>;
	readonly commands?: Readonly<CommandDataMap>;
}

export class History {
	public readonly uuid: string;
	public name: string;
	public readonly readonly: boolean;
	private _active: string | null;
	private _branches: BranchTable;
	private _commands: CommandMap;

	public get active(): string | null { return this._active; }
	public set active(value: string | null) {
		if (value !== null && !(value in this._branches)) throw new Error(`Branch not found: ${value}`);

		this._active = value;
	}

	public get branches(): Readonly<BranchTable> { return this._branches; }

	public get commands(): Readonly<CommandMap> { return this._commands; }

	public get head(): string | null { return this.active !== null ? this.branches[this.active] : null; }

	public constructor({ uuid, name, active, branches, commands }: HistoryData, readonly?: boolean) {
		this.uuid = validation.uuid(uuid);
		this.name = validation.string(name);
		this._active = validation.string_null(active);
		this._branches = validation.table(branches, validation.string_null);
		this._commands = validation.table(commands, data => new Command(data));
		this.readonly = Boolean(readonly);

		this.validate();
	}

	public toJSON(): HistoryData {
		return {
			uuid: this.uuid,
			name: this.name,
			active: this.active,
			branches: this.branches,
			commands: this.commands,
		};
	}

	public trace(hash: string | null = this.head): IterableIterator<Command> {
		this.ensureCommandExists(hash);

		return generator(this.commands, hash);

		function* generator(commands: CommandMap, hash: string | null) {
			for (let x = hash; x !== null; x = commands[x].parent) yield commands[x];
		};
	}

	public sequence(hash: string | null = this.head): Command[] {
		return [...this.trace(hash)].reverse();
	}

	public fork(name: string, hash: string | null = this.head): void {
		this.ensureBranchNotExist(name);
		this.ensureCommandExists(hash);

		this._branches[name] = hash;
	}

	public prune(name: string): void {
		this.ensureBranchExists(name);

		delete this._branches[name];
	}

	public move(name: string, hash: string | null): void {
		this.ensureBranchExists(name);
		this.ensureCommandExists(hash);

		this._branches[name] = hash;
	}

	public commit(command: Command): void {
		if (this.active === null) throw new Error(`No active branch.`);
		if (command.parent !== this.head) throw new Error(`Head and command's parent not match: ${command}`);
		if (command.hash in this.commands) throw new Error(`Hash collision occurred: ${command}`);

		this._commands[command.hash] = command;
		this._branches[this.active] = command.hash;
	}

	public gc(): void {
		const traceable = Object.create(null) as CommandMap;
		for (const branch of Object.values(this.branches)) {
			for (let hash = branch, command; hash !== null && !(hash in traceable); hash = command.parent) {
				command = traceable[hash] = this.commands[hash];
			}
		}

		this._commands = traceable;
	}

	private validate(): void | never {
		const unmatched = Object.entries(this.commands)
			.filter(([hash, command]) => hash !== command.hash)
			.map(([hash, command]) => command);
		if (unmatched.length > 0) throw new Error(`Command's key and hash not match:\n${unmatched.join("\n\t")}`);

		const unreachable = Object.values(this.commands)
			.filter(command => command.parent !== null && !(command.parent in this.commands))
			.sort((x, y) => x.time - y.time);
		if (unreachable.length > 0) throw new Error(`Unreachable command detected:\n${unreachable.join("\n\t")}`);

		const invalid = Object.entries(this.branches)
			.filter(([key, value]) => value !== null && !(value in this.commands))
			.map(([key, value]) => key);
		if (invalid.length > 0) throw new Error(`Invalid branch detected: ${invalid.join(", ")}`);

		if (this.active !== null && !(this.active in this.branches)) throw new Error(`Active branch not found: ${this.active}`);
	}

	private ensureBranchExists(name: string): void | never {
		if (!(name in this.branches)) throw new Error(`Branch not found: ${name}`);
	}

	private ensureBranchNotExist(name: string): void | never {
		if (name in this.branches) throw new Error(`Branch already exists: ${name}`);
	}

	private ensureCommandExists(hash: string | null): void | never {
		if (hash !== null && !(hash in this.commands)) throw new Error(`Command not found: ${hash}`);
	}
}
