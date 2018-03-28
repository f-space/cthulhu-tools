import { ProfileData, Profile } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { setProfile, deleteProfile, setDefaultProfile } from "redux/actions/profile";
import BUILTIN_PROFILES_URL from "@resource/data/profiles.json";

export default class ProfileDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(profile: Profile): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.add(profile.toJSON());
		}).then(() => {
			this.dispatch(setProfile(profile));
		});
	}

	public async update(profile: Profile): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.update(profile.uuid, profile.toJSON());
		}).then(() => {
			this.dispatch(setProfile(profile));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.delete(uuid);
		}).then(() => {
			this.dispatch(deleteProfile(uuid));
		});
	}

	public async load(): Promise<void> {
		await this.loadBuiltins();
		await DB.transaction("r", DB.profiles, () => {
			return DB.profiles.toArray();
		}).then(profiles => {
			for (const profile of profiles) {
				this.dispatch(setProfile(new Profile(profile)));
			}
		});
	}

	public async loadBuiltins(url: string = BUILTIN_PROFILES_URL): Promise<void> {
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
				this.dispatch(setProfile(instance));
				if (profile.default) this.dispatch(setDefaultProfile(instance.uuid));
			}
		});
	}
}