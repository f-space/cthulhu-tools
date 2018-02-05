import { Character } from "models/character";
import { Profile } from "models/profile";
import { Attribute } from "models/attribute";
import { Skill } from "models/skill";
import { Item } from "models/item";
import { History } from "models/history";

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

interface IDKeyedProvider<T> {
	get(id: string): T | undefined;
	get(ids: ReadonlyArray<string>): T[];
	list(): T[];
}

export interface CharacterProvider extends UUIDKeyedProvider<Character> { }
export interface ProfileProvider extends UUIDKeyedProvider<Profile> { readonly default: Profile | undefined; }
export interface AttributeProvider extends UUIDKeyedProvider<Attribute> { }
export interface SkillProvider extends IDKeyedProvider<Skill> { }
export interface ItemProvider extends UUIDKeyedProvider<Item> { }
export interface HistoryProvider extends UUIDKeyedProvider<History> { }