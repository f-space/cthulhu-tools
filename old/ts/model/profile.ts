import { Attribute } from "./attribute";
import { generateUUID, requestJSON } from "./utility";

export interface SkillSlotsData {
	readonly initial?: number;
	readonly min?: number;
	readonly max?: number;
}

export class SkillSlots implements SkillSlotsData {
	private readonly _initial?: number;
	private readonly _min?: number;
	private readonly _max?: number;
	public get initial(): number { return (this._initial !== undefined ? this._initial : this.min); }
	public get min(): number { return (this._min !== undefined ? this._min : 0); }
	public get max(): number { return (this._max !== undefined ? this._max : Infinity); }

	public constructor(data: SkillSlotsData);
	public constructor(initial?: number, min?: number, max?: number);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as SkillSlotsData;

			if (data.initial !== undefined) this._initial = Number(data.initial);
			if (data.min !== undefined) this._min = Number(data.min);
			if (data.max !== undefined) this._max = Number(data.max);
		} else {
			const initial = args[0] as number | undefined;
			const min = args[1] as number | undefined;
			const max = args[2] as number | undefined;

			this._initial = initial;
			this._min = min;
			this._max = max;
		}
	}

	public toJSON(): SkillSlotsData {
		return {
			initial: this._initial,
			min: this._min,
			max: this._max,
		};
	}
}

export interface ItemSlotsData {
	readonly initial?: number;
	readonly min?: number;
	readonly max?: number;
}

export class ItemSlots implements ItemSlotsData {
	private readonly _initial?: number;
	private readonly _min?: number;
	private readonly _max?: number;
	public get initial(): number { return (this._initial !== undefined ? this._initial : this.min); }
	public get min(): number { return (this._min !== undefined ? this._min : 0); }
	public get max(): number { return (this._max !== undefined ? this._max : Infinity); }

	public constructor(data: ItemSlotsData);
	public constructor(initial?: number, min?: number, max?: number);
	public constructor(...args: any[]) {
		if (args.length === 1 && typeof args[0] === 'object') {
			const data = args[0] as ItemSlotsData;

			if (data.initial !== undefined) this._initial = Number(data.initial);
			if (data.min !== undefined) this._min = Number(data.min);
			if (data.max !== undefined) this._max = Number(data.max);
		} else {
			const initial = args[0] as number | undefined;
			const min = args[1] as number | undefined;
			const max = args[2] as number | undefined;

			this._initial = initial;
			this._min = min;
			this._max = max;
		}
	}

	public toJSON(): ItemSlotsData {
		return {
			initial: this._initial,
			min: this._min,
			max: this._max,
		};
	}
}

export interface ProfileData {
	readonly uuid?: string;
	readonly version?: number;
	readonly name: string;
	readonly attributes: string[];
	readonly skillSlots: SkillSlotsData;
	readonly itemSlots: ItemSlotsData;
}

export class Profile implements ProfileData {
	public readonly uuid: string;
	public readonly version: number;
	public readonly name: string;
	public readonly attributes: string[];
	public readonly skillSlots: SkillSlots;
	public readonly itemSlots: ItemSlots;
	private _default: boolean;

	public get default(): boolean { return this._default; }

	public constructor(data: ProfileData, uuid: string = data.uuid || generateUUID(), version: number = data.version || 0) {
		this.uuid = String(uuid);
		this.version = Number(version);
		this.name = String(data.name);
		this.attributes = Array.from(data.attributes).map(x => String(x));
		this.skillSlots = new SkillSlots(data.skillSlots);
		this.itemSlots = new ItemSlots(data.itemSlots);
		this._default = false;
	}

	public toJSON(): ProfileData {
		return {
			uuid: this.uuid,
			version: this.version,
			name: this.name,
			attributes: this.attributes,
			skillSlots: this.skillSlots,
			itemSlots: this.itemSlots,
		};
	}

	public markAsDefault(): this {
		return (this._default = true, this);
	}
}

type ProfileTable = { [uuid: string]: Profile };

export class ProfileManager implements Iterable<Profile> {
	private _table: ProfileTable = Object.create(null);

	public contains(uuid: string): boolean {
		return (uuid in this._table);
	}

	public get(uuid: string): Profile | undefined {
		return this._table[uuid];
	}

	public list(): Profile[] { return Object.keys(this._table).map(x => this._table[x]); }

	public add(profile: Profile): void {
		const uuid = profile.uuid;
		const item = this._table[uuid];
		if (item === undefined || !item.default) {
			this._table[uuid] = profile;
		}
	}

	public remove(profile: Profile): void {
		const uuid = profile.uuid;
		const item = this._table[uuid];
		if (item !== undefined && !item.default) {
			delete this._table[uuid];
		}
	}

	public async load(url: string, asDefault: boolean = false): Promise<void> {
		const data = await requestJSON(url) as ProfileData[];

		for (const entry of data) {
			const profile = new Profile(entry);
			if (asDefault) profile.markAsDefault();
			this.add(profile);
		}
	}

	public import(data?: ReadonlyArray<ProfileData>): void {
		if (Array.isArray(data)) {
			for (const profile of data) {
				this.add(new Profile(profile));
			}
		}
	}

	public [Symbol.iterator](): Iterator<Profile> {
		return this.list()[Symbol.iterator]();
	}
}