import { CommandData, Command } from "./command";
import * as validation from "./validation";

export interface HistoryData {
	readonly uuid: string;
	readonly name: string;
	readonly head: string | null;
	readonly commands?: ReadonlyArray<CommandData>;
}

export interface HistoryConfig {
	readonly uuid: string;
	readonly name: string;
	readonly head: string | null;
	readonly commands?: ReadonlyArray<Command>;
}

export class History {
	public readonly uuid: string;
	public readonly name: string;
	public readonly readonly: boolean;

	private _head: string | null;
	private _commands: Map<string, Command>;

	public get head(): string | null { return this._head; }
	public set head(value: string | null) { this._head = value; }
	public get commands(): ReadonlyMap<string, Command> { return this._commands; }

	public constructor({ uuid, name, head, commands }: HistoryConfig, readonly?: boolean) {
		this.uuid = uuid;
		this.name = name;
		this._head = head;
		this._commands = commands !== undefined ? History.toMap(commands) : new Map();
		this.readonly = Boolean(readonly);
	}

	public static from({ uuid, name, head, commands }: HistoryData, readonly?: boolean): History {
		return new History({
			uuid: validation.uuid(uuid),
			name: validation.string(name),
			head: validation.string_null(head),
			commands: validation.array(commands, Command.from),
		}, readonly);
	}

	public toJSON(): HistoryData {
		return {
			uuid: this.uuid,
			name: this.name,
			head: this.head,
			commands: Array.from(this.commands.values()).map(command => command.toJSON()),
		};
	}

	public set(config: Partial<HistoryConfig>): History {
		const { uuid, name, head, commands } = this;

		return new History({ uuid, name, head, commands: Array.from(commands.values()), ...config });
	}

	public *trace(hash: string | null = this.head): IterableIterator<Command> {
		for (let command; command = this.commands.get(hash as any); hash = command.parent) yield command;
	}

	public sequence(hash: string | null = this.head): Command[] {
		return [...this.trace(hash)].reverse();
	}

	public commit(command: Command): void {
		if (this._commands.has(command.hash)) throw new Error(`Hash collision occurred: ${command}`);

		this._commands.set(command.hash, command);
	}

	public gc(): void {
		this._commands = History.toMap(Array.from(this.trace()));
	}

	private static toMap(commands: ReadonlyArray<Command>): Map<string, Command> {
		return commands.reduce((map, command) => map.set(command.hash, command), new Map<string, Command>());
	}
}