import Dexie from 'dexie';
import { CharacterViewData, CharacterData } from 'models/character';
import { ProfileData } from 'models/profile';
import { AttributeData } from 'models/attribute';
import { SkillData } from 'models/skill';
import { ItemData } from 'models/item';
import { HistoryData } from 'models/history';
import { CacheEntry } from 'models/cache';

export class StatusDatabase extends Dexie {
	public readonly views: Dexie.Table<CharacterViewData, string>;
	public readonly characters: Dexie.Table<CharacterData, string>;
	public readonly profiles: Dexie.Table<ProfileData, string>;
	public readonly attributes: Dexie.Table<AttributeData, string>;
	public readonly skills: Dexie.Table<SkillData, string>;
	public readonly items: Dexie.Table<ItemData, string>;
	public readonly histories: Dexie.Table<HistoryData, string>;
	public readonly caches: Dexie.Table<CacheEntry, number>;

	public constructor() {
		super("status");

		this.version(1).stores({
			views: "target",
			characters: "uuid",
			profiles: "uuid",
			attributes: "uuid",
			skills: "id",
			items: "uuid",
			histories: "uuid",
			caches: "key, date",
		})
	}
}

export default new StatusDatabase();