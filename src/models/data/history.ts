import { CommandData, Command } from "./command";
import { validate } from "./validation";

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

export class History implements HistoryConfig {
	public readonly uuid: string;
	public readonly name: string;
	public readonly readonly: boolean;

	private _head: string | null;
	private _commands: Map<string, Command>;

	public get head(): string | null { return this._head; }
	public set head(value: string | null) { this._head = value; }
	public get commands(): ReadonlyArray<Command> { return Array.from(this._commands.values()); }

	public constructor({ uuid, name, head, commands }: HistoryConfig, readonly?: boolean) {
		this.uuid = uuid;
		this.name = name;
		this._head = head;
		this._commands = commands !== undefined ? History.toMap(commands) : new Map();
		this.readonly = Boolean(readonly);
	}

	public static from({ uuid, name, head, commands }: HistoryData, readonly?: boolean): History {
		return new History({
			uuid: validate("uuid", uuid).string().uuid().value,
			name: validate("name", name).string().nonempty().value,
			head: validate("head", head).nullable(v => v.string()).value,
			commands: validate("commands", commands).optional(v => v.array(v => v.object<CommandData>().map(Command.from))).value,
		}, readonly);
	}

	public toJSON(): HistoryData {
		return {
			uuid: this.uuid,
			name: this.name,
			head: this.head,
			commands: this.commands.map(command => command.toJSON()),
		};
	}

	public set(config: Partial<HistoryConfig>): History {
		const { uuid, name, head, commands } = this;

		return new History({ uuid, name, head, commands, ...config });
	}

	public command(hash: string | null): Command | undefined {
		return hash !== null ? this._commands.get(hash) : undefined;
	}

	public *trace(hash: string | null = this.head): IterableIterator<Command> {
		for (let command: Command | undefined; command = this.command(hash); hash = command.parent) yield command;
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