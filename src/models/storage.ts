import Dexie from 'dexie';
import { CharacterViewData, CharacterData, ProfileData, AttributeData, SkillData, ItemData, HistoryData } from 'models/data';

export class StatusDatabase extends Dexie {
	public constructor() {
		super("status");

		this.version(1).stores({
			views: "target",
			characters: "uuid",
			profiles: "uuid",
			attributes: "uuid",
			skills: "uuid",
			items: "uuid",
			histories: "uuid",
		})
	}
}

export interface StatusDatabase {
	readonly views: Dexie.Table<CharacterViewData, string>;
	readonly characters: Dexie.Table<CharacterData, string>;
	readonly profiles: Dexie.Table<ProfileData, string>;
	readonly attributes: Dexie.Table<AttributeData, string>;
	readonly skills: Dexie.Table<SkillData, string>;
	readonly items: Dexie.Table<ItemData, string>;
	readonly histories: Dexie.Table<HistoryData, string>;
}

export default new StatusDatabase();