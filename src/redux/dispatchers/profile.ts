import { ProfileData, Profile } from "models/status";
import DB from "models/storage";
import { Dispatch } from "redux/store";
import { ProfileAction } from "redux/actions/profile";
import BUILTIN_PROFILES_URL from "assets/data/profiles.json";

export default class ProfileDispatcher {
	public constructor(readonly dispatch: Dispatch) { }

	public async create(profile: Profile): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.add(profile.toJSON());
		}).then(() => {
			this.dispatch(ProfileAction.set(profile));
		});
	}

	public async update(profile: Profile): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.update(profile.uuid, profile.toJSON());
		}).then(() => {
			this.dispatch(ProfileAction.set(profile));
		});
	}

	public async delete(uuid: string): Promise<void> {
		await DB.transaction("rw", DB.profiles, () => {
			return DB.profiles.delete(uuid);
		}).then(() => {
			this.dispatch(ProfileAction.delete(uuid));
		});
	}

	public async load(): Promise<void> {
		await this.loadBuiltins();
		await DB.transaction("r", DB.profiles, () => {
			return DB.profiles.toArray();
		}).then(profiles => {
			this.dispatch(ProfileAction.set(this.validate(profiles)));
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
			const profiles = (Array.isArray(data) ? data : [data]) as ProfileData[];
			this.dispatch(ProfileAction.set(this.validate(profiles, true)));

			const defaultProfile = profiles[0];
			if (defaultProfile && defaultProfile.uuid) {
				this.dispatch(ProfileAction.setDefault(defaultProfile.uuid));
			}
		});
	}

	private validate(profiles: ReadonlyArray<ProfileData>, readonly?: boolean): Profile[] {
		const result = [] as Profile[];
		for (const profile of profiles) {
			try {
				result.push(Profile.from(profile, readonly));
			} catch (e) {
				if (e instanceof Error) {
					console.error(`Failed to load a profile: ${e.message}`);
				} else throw e;
			}
		}
		return result;
	}
}