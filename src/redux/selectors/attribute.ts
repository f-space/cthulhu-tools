import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Attribute, AttributeProvider } from "models/status";
import { State } from "redux/store";

class Provider implements AttributeProvider {
	constructor(readonly attributes: Map<string, Attribute>) { }

	public get(uuid: string): Attribute | undefined;
	public get(uuids: string[]): Attribute[];
	public get(uuids: string | string[]): Attribute | Attribute[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.attributes.get(uuid)).filter(x => x !== undefined) as Attribute[]
			: this.attributes.get(uuids);
	}

	public list(): Attribute[] { return [...this.attributes.values()]; }
}

export const getAttributeState = (state: State) => state.attribute;

export const getAttributes = createSelector(getAttributeState, state => state.attributes);

export const getAttributeProvider = createSelector(getAttributes, attributes => new Provider(attributes));
