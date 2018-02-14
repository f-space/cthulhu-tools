import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Profile, ProfileProvider } from "models/status";
import { ProfileState } from "redux/reducers/profile";

class Provider implements ProfileProvider {
	constructor(readonly profiles: Map<string, Profile>, readonly defaultUUID: string | null) { }

	public get default(): Profile | undefined { return this.defaultUUID ? this.profiles.get(this.defaultUUID) : undefined; }

	public get(uuid: string): Profile | undefined;
	public get(uuids: string[]): Profile[];
	public get(uuids: string | string[]): Profile | Profile[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.profiles.get(uuid)).filter(x => x !== undefined)
			: this.profiles.get(uuids);
	}

	public list(): Profile[] { return [...this.profiles.values() as IterableIterator<Profile>]; }
}

export const getProfileProvider = createSelector(
	(state: ProfileState) => state.profiles,
	(state: ProfileState) => state.default,
	(profiles, defaultUUID) => new Provider(profiles, defaultUUID)
);
