import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Profile, ProfileProvider } from "models/status";
import { State } from "redux/store";

class Provider implements ProfileProvider {
	constructor(readonly profiles: Map<string, Profile>, readonly defaultUUID: string | null) { }

	public get default(): Profile | undefined { return this.defaultUUID ? this.profiles.get(this.defaultUUID) : undefined; }

	public get(uuid: string): Profile | undefined;
	public get(uuids: string[]): Profile[];
	public get(uuids: string | string[]): Profile | Profile[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.profiles.get(uuid)).filter(x => x !== undefined) as Profile[]
			: this.profiles.get(uuids);
	}

	public list(): Profile[] { return [...this.profiles.values()]; }
}

export const getProfileState = (state: State) => state.profile;

export const getProfiles = createSelector(getProfileState, state => state.profiles);

export const getDefaultProfile = createSelector(getProfileState, state => state.default);

export const getProfileProvider = createSelector(getProfiles, getDefaultProfile, (profiles, defaultUUID) => new Provider(profiles, defaultUUID));