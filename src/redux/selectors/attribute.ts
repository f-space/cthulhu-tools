import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { Attribute, AttributeProvider } from "models/status";
import { AttributeState } from "redux/reducers/attribute";

class Provider implements AttributeProvider {
	constructor(readonly attributes: Map<string, Attribute>) { }

	public get(uuid: string): Attribute | undefined;
	public get(uuids: string[]): Attribute[];
	public get(uuids: string | string[]): Attribute | Attribute[] | undefined {
		return Array.isArray(uuids)
			? uuids.map(uuid => this.attributes.get(uuid)).filter(x => x !== undefined)
			: this.attributes.get(uuids);
	}

	public list(): Attribute[] { return [...this.attributes.values() as IterableIterator<Attribute>]; }
}

export const getAttributeProvider = createSelector(
	(state: AttributeState) => state.attributes,
	(attributes) => new Provider(attributes)
);
