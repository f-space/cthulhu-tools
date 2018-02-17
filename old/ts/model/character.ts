import { Profile, ProfileManager } from "./profile";
import { InputDataTable, InputDataSet } from "./input";
import { SkillPointTable, SkillPointSet } from "./skill";
import { ItemData, Item } from "./item";
import { HistoryData, History } from "./operation";
import { generateUUID } from "./utility";

export interface CharacterData {
	readonly uuid?: string;
	readonly profile: string;
	readonly inputs?: InputDataTable | InputDataSet;
	readonly points?: SkillPointTable | SkillPointSet;
	readonly items?: ItemData[];
	readonly history?: HistoryData;
	readonly visible?: boolean;
}

export class Character implements CharacterData {
	public readonly uuid: string;
	public readonly profile: string;
	public readonly inputs: InputDataSet;
	public readonly points: SkillPointSet;
	public readonly items: Item[];
	public readonly history: History;
	public visible: boolean;

	public constructor(data: CharacterData, uuid?: string);
	public constructor(profile: string);
	public constructor(...args: any[]) {
		if (args.length >= 1 && typeof args[0] === 'object') {
			const data = args[0] as CharacterData;
			const uuid = args[1] as string | undefined;

			this.uuid = String(uuid !== undefined ? uuid : (data.uuid || generateUUID()));
			this.profile = String(data.profile);
			this.inputs = new InputDataSet(data.inputs);
			this.points = new SkillPointSet(data.points);
			this.items = Array.from(data.items || []).map(x => new Item(x));
			this.history = new History(data.history);
			this.visible = (data.visible !== undefined ? Boolean(data.visible) : true);
		} else {
			const profile = args[0] as string;

			this.uuid = generateUUID();
			this.profile = profile;
			this.inputs = new InputDataSet();
			this.points = new SkillPointSet();
			this.items = [];
			this.history = new History();
			this.visible = true;
		}
	}

	public toJSON(): CharacterData {
		return {
			uuid: this.uuid,
			profile: this.profile,
			inputs: this.inputs,
			points: this.points,
			items: this.items,
			history: this.history,
			visible: this.visible,
		};
	}
}

type CharacterTable = { [uuid: string]: Character };

export type CharacterListOperation = 'add' | 'remove' | 'update';

export interface CharacterListListener {
	onCharacterListChanged(operation: CharacterListOperation, target: Character): void;
}

export class CharacterManager implements Iterable<Character> {
	private _table: CharacterTable = Object.create(null);
	private _listeners: CharacterListListener[] = [];

	public contains(uuid: string): boolean {
		return (uuid in this._table);
	}

	public get(uuid: string): Character | undefined {
		return this._table[uuid];
	}

	public list(): Character[] { return Object.keys(this._table).map(x => this._table[x]); }

	public add(character: Character): void {
		const updated = this.contains(character.uuid);
		this._table[character.uuid] = character;
		this.raiseListChangedEvent(updated ? 'update' : 'add', character);
	}

	public remove(character: Character): void {
		if (this.get(character.uuid) === character) {
			delete this._table[character.uuid];
			this.raiseListChangedEvent('remove', character);
		}
	}

	public import(data?: ReadonlyArray<CharacterData>): void {
		if (Array.isArray(data)) {
			for (const character of data) {
				this.add(new Character(character));
			}
		}
	}

	public refresh(character: Character): void {
		if (this.get(character.uuid) === character) {
			this.raiseListChangedEvent('update', character);
		}
	}

	public addListener(listener: CharacterListListener): void {
		this._listeners.push(listener);
	}

	public removeListener(listener: CharacterListListener): void {
		const index = this._listeners.lastIndexOf(listener);
		if (index !== -1) this._listeners.splice(index, 1);
	}

	public [Symbol.iterator](): Iterator<Character> {
		return this.list()[Symbol.iterator]();
	}

	private raiseListChangedEvent(operation: CharacterListOperation, target: Character): void {
		for (const listener of this._listeners) {
			listener.onCharacterListChanged(operation, target);
		}
	}
}
