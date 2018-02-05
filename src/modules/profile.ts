import Vue from 'vue';
import { ProfileData, Profile, ProfileProvider } from "models/status";
import DB from "models/storage";
import { Module, Getter, Mutation, Action } from "modules/vuex-class-module";

type ProfileTable = { [uuid: string]: Profile };

@Module({ namespaced: true })
export default class ProfileModule implements ProfileProvider {
	public profiles: ProfileTable = Object.create(null);
	public defaultUUID: string | null = null;

	@Getter
	public get provider(): ProfileProvider { return this; }

	@Getter
	public get default(): Profile | undefined { return this.defaultUUID !== null ? this.profiles[this.defaultUUID] : undefined; }

	@Mutation
	public set_profile(profile: Profile): void {
		const old = this.profiles[profile.uuid];
		if (old === undefined || profile.version > old.version) {
			Vue.set(this.profiles, profile.uuid, profile);
		}
	}

	@Mutation
	public delete_profile(uuid: string): void {
		Vue.delete(this.profiles, uuid);
	}

	@Mutation
	public set_default(uuid: string): void {
		this.defaultUUID = uuid;
	}

	@Action
	public async create(profile: Profile): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.add(profile.toJSON());
		}).then(() => {
			this.set_profile(profile);
		});
	}

	@Action
	public async update(profile: Profile): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.update(profile.uuid, profile.toJSON());
		}).then(() => {
			this.set_profile(profile);
		});
	}

	@Action
	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.delete(uuid);
		}).then(() => {
			this.delete_profile(uuid);
		});
	}

	@Action
	public async load(): Promise<void> {
		await DB.transaction("r", DB.profiles, () => {
			return DB.profiles.toArray();
		}).then(profiles => {
			for (const profile of profiles) {
				this.set_profile(new Profile(profile));
			}
		});
	}

	@Action
	public async loadBuiltins(url: string): Promise<void> {
		await fetch(url).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error(`${response.statusText}: ${url}`);
			}
		}).then(data => {
			const profiles = (Array.isArray(data) ? data : [data]) as (ProfileData & { default?: boolean })[];
			for (const profile of profiles) {
				const instance = new Profile(profile, true);
				this.set_profile(instance);
				if (profile.default) this.set_default(instance.uuid);
			}
		});
	}

	public get(uuid: string): Profile | undefined;
	public get(uuids: string[]): Profile[];
	public get(uuids: string | string[]): Profile | Profile[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.profiles[uuid]).filter(x => x !== undefined)
			: this.profiles[uuids];
	}

	public list(): Profile[] { return Object.values(this.profiles); }
}