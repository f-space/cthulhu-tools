import { Property, PropertyProvider, PropertyEvaluator, PropertyResolver } from "./property";
import evaluate from "./evaluation";
import { requestJSON } from "./utility";

export type SkillCategory = 'locomotion' | 'exploration' | 'knowledge' | 'communication' | 'language' | 'combat' | 'special' | 'other';

export interface SkillData {
	readonly id: string;
	readonly name: string;
	readonly category: SkillCategory;
	readonly dependencies: string[];
	readonly base: number | string;
}

const CATEGORIES: {[C in SkillCategory]: C | undefined} = {
	locomotion: 'locomotion',
	exploration: 'exploration',
	knowledge: 'knowledge',
	communication: 'communication',
	language: 'language',
	combat: 'combat',
	special: 'special',
	other: 'other',
};

export class Skill implements Property, SkillData {
	public static readonly MIN_VALUE = 0;
	public static readonly MAX_VALUE = 99;

	public readonly id: string;
	public readonly name: string;
	public readonly category: SkillCategory;
	public readonly dependencies: string[];
	public readonly base: number | string;
	private _default: boolean;

	public get view(): false { return false; }
	public get default(): boolean { return this._default; }

	public constructor(data: SkillData) {
		this.id = String(data.id);
		this.name = String(data.name);
		this.category = CATEGORIES[data.category] || 'other';
		this.dependencies = Array.from(data.dependencies).map(x => String(x));
		this.base = (isFiniteOrString(data.base) ? data.base : 0);
	}

	public toJSON(): SkillData {
		return {
			id: this.id,
			name: this.name,
			category: this.category,
			dependencies: this.dependencies,
			base: this.base,
		};
	}

	public markAsDefault(): this {
		return (this._default = true, this);
	}

	public evaluate(points: SkillPointSet | null, resolver: PropertyResolver): number {
		const base = (typeof this.base === 'number' ? this.base : evaluate(this.base, resolver));
		const extra = ((points !== null && points.get(this.id)) || 0);
		return (base + extra);
	}

	public validate(points: SkillPointSet | null, resolver: PropertyResolver, value: number): number {
		return (Math.max(Math.min(value, Skill.MAX_VALUE), Skill.MIN_VALUE) | 0);
	}
}

export type SkillPointTable = { [id: string]: number };

export class SkillPointSet implements Iterable<[string, number]> {
	private _data: SkillPointTable;

	public constructor(data?: SkillPointTable | SkillPointSet) {
		this.clear();
		this.merge(data);
	}

	public toJSON(): SkillPointTable {
		return this._data;
	}

	public clear(): void {
		this._data = Object.create(null);
	}

	public contains(id: string): boolean {
		return (id in this._data);
	}

	public get(id: string): number {
		return (id in this._data ? this._data[id] : 0);
	}

	public set(id: string, value: number): void {
		if (value !== 0) {
			this._data[id] = value;
		} else {
			delete this._data[id];
		}
	}

	public merge(data?: SkillPointTable | SkillPointSet): void {
		if (data instanceof SkillPointSet) {
			Object.assign(this._data, data._data);
		} else {
			Object.assign(this._data, data);
		}
	}

	public skills(): string[] {
		return Object.keys(this._data);
	}

	public [Symbol.iterator](): Iterator<[string, number]> {
		return Object.keys(this._data).map(key => [key, this._data[key]] as [string, number])[Symbol.iterator]();
	}
}

type SkillTable = { [id: string]: Skill };

export class SkillManager implements Iterable<Skill> {
	private _table: SkillTable = Object.create(null);

	public contains(id: string): boolean {
		return (id in this._table);
	}

	public get(id: string): Skill | undefined {
		return this._table[id];
	}

	public list(): Skill[] { return Object.keys(this._table).map(key => this._table[key]); }

	public add(skill: Skill): void {
		const id = skill.id;
		const item = this._table[id];
		if (item === undefined || !item.default) {
			this._table[id] = skill;
		}
	}

	public remove(skill: Skill): void {
		const id = skill.id;
		const item = this._table[id];
		if (item !== undefined && !item.default) {
			delete this._table[id];
		}
	}

	public async load(url: string, asDefault: boolean = false): Promise<void> {
		const data = await requestJSON(url) as SkillData[];

		for (const entry of data) {
			const skill = new Skill(entry);
			if (asDefault) skill.markAsDefault();
			this.add(skill);
		}
	}

	public import(data?: ReadonlyArray<SkillData>): void {
		if (Array.isArray(data)) {
			for (const skill of data) {
				this.add(new Skill(skill));
			}
		}
	}

	public [Symbol.iterator](): Iterator<Skill> {
		return this.list()[Symbol.iterator]();
	}
}

export class SkillProvider implements PropertyProvider {
	public constructor(readonly manager: SkillManager) { }

	public property(id: string): Skill | undefined {
		return this.manager.get(id);
	}
}

export class SkillEvaluator implements PropertyEvaluator {
	public constructor(readonly points: SkillPointSet) { }

	public supports(property: Property): boolean {
		return (property instanceof Skill);
	}

	public evaluate(property: Property, resolver: PropertyResolver): any {
		return (property instanceof Skill ? property.evaluate(this.points, resolver) : undefined);
	}

	public validate(property: Property, resolver: PropertyResolver, value: any): any {
		return (property instanceof Skill ? property.validate(this.points, resolver, value) : value);
	}
}

function isFiniteOrString(x: any): boolean {
	return Number.isFinite(x) || typeof x === 'string';
}