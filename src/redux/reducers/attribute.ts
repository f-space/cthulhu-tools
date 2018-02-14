import { Map } from 'immutable';
import { Attribute } from "models/status";
import { Action } from "redux/actions/root";
import { ATTRIBUTE_SET, ATTRIBUTE_DELETE } from "redux/actions/attribute";

export interface AttributeState {
	attributes: Map<string, Attribute>;
}

export function AttributeReducer(state: AttributeState = { attributes: Map() }, action: Action): AttributeState {
	switch (action.type) {
		case ATTRIBUTE_SET:
			return { attributes: state.attributes.set(action.attribute.uuid, action.attribute) };
		case ATTRIBUTE_DELETE:
			return { attributes: state.attributes.delete(action.uuid) };
		default:
			return state;
	}
}