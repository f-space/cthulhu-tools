import { CommitData, Commit } from "./commit";
import { validate } from "./validation";

export interface HistoryData {
	readonly uuid: string;
	readonly name: string;
	readonly head: string | null;
	readonly commits?: ReadonlyArray<CommitData>;
}

export interface HistoryConfig {
	readonly uuid: string;
	readonly name: string;
	readonly head: string | null;
	readonly commits?: ReadonlyArray<Commit>;
}

export class History implements HistoryConfig {
	public readonly uuid: string;
	public readonly name: string;
	public readonly readonly: boolean;

	private _head: string | null;
	private _commits: Map<string, Commit>;

	public get head(): string | null { return this._head; }
	public set head(value: string | null) { this._head = value; }
	public get commits(): ReadonlyArray<Commit> { return Array.from(this._commits.values()); }

	public constructor({ uuid, name, head, commits }: HistoryConfig, readonly?: boolean) {
		this.uuid = uuid;
		this.name = name;
		this._head = head;
		this._commits = commits !== undefined ? History.toMap(commits) : new Map();
		this.readonly = Boolean(readonly);
	}

	public static from({ uuid, name, head, commits }: HistoryData, readonly?: boolean): History {
		return new History({
			uuid: validate("uuid", uuid).string().uuid().value,
			name: validate("name", name).string().nonempty().value,
			head: validate("head", head).nullable(v => v.string()).value,
			commits: validate("commits", commits).optional(v => v.array(v => v.object<CommitData>().map(Commit.from))).value,
		}, readonly);
	}

	public toJSON(): HistoryData {
		return {
			uuid: this.uuid,
			name: this.name,
			head: this.head,
			commits: this.commits.map(commit => commit.toJSON()),
		};
	}

	public set(config: Partial<HistoryConfig>): History {
		const { uuid, name, head, commits } = this;

		return new History({ uuid, name, head, commits, ...config });
	}

	public find(hash: string | null): Commit | undefined {
		return hash !== null ? this._commits.get(hash) : undefined;
	}

	public *trace(hash: string | null = this.head): IterableIterator<Commit> {
		for (let commit: Commit | undefined; commit = this.find(hash); hash = commit.parent) yield commit;
	}

	public sequence(hash: string | null = this.head): Commit[] {
		return [...this.trace(hash)].reverse();
	}

	public commit(commit: Commit): void {
		if (this._commits.has(commit.hash)) throw new Error(`Hash collision occurred: ${commit}`);

		this._commits.set(commit.hash, commit);
	}

	public gc(): void {
		this._commits = History.toMap(Array.from(this.trace()));
	}

	private static toMap(commits: ReadonlyArray<Commit>): Map<string, Commit> {
		return commits.reduce((map, commit) => map.set(commit.hash, commit), new Map<string, Commit>());
	}
}