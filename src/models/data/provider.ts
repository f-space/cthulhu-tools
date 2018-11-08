import { Character } from "./character";
import { Profile } from "./profile";
import { Attribute } from "./attribute";
import { Skill } from "./skill";
import { Item } from "./item";
import { History } from "./history";

export interface DataProvider {
	readonly character: CharacterProvider;
	readonly profile: ProfileProvider;
	readonly attribute: AttributeProvider;
	readonly skill: SkillProvider;
	readonly item: ItemProvider;
	readonly history: HistoryProvider;
}

interface UUIDKeyedProvider<T> {
	get(uuid: string): T | undefined;
	get(uuids: ReadonlyArray<string>): T[];
	list(): T[];
}

export interface CharacterProvider extends UUIDKeyedProvider<Character> { }
export interface ProfileProvider extends UUIDKeyedProvider<Profile> { readonly default: Profile | undefined; }
export interface AttributeProvider extends UUIDKeyedProvider<Attribute> { }
export interface SkillProvider extends UUIDKeyedProvider<Skill> { }
export interface ItemProvider extends UUIDKeyedProvider<Item> { }
export interface HistoryProvider extends UUIDKeyedProvider<History> { }