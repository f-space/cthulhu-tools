import { Map } from 'immutable';
import { Attribute } from "models/status";

export interface AttributeState {
	attributes: Map<string, Attribute>;
}

export const INITIAL_ATTRIBUTE_STATE: AttributeState = {
	attributes: Map(),
};