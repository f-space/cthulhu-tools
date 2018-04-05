import { Map } from 'immutable';
import { Attribute } from "models/status";
import { Action } from "redux/actions/root";
import { AttributeActionType, LoadState } from "redux/actions/attribute";

export interface AttributeState {
	attributes: Map<string, Attribute>;
	loadState: LoadState;
}

export const INITIAL_STATE: AttributeState = {
	attributes: Map(),
	loadState: 'unloaded',
};

export function AttributeReducer(state: AttributeState = INITIAL_STATE, action: Action): AttributeState {
	switch (action.type) {
		case AttributeActionType.Set:
			{
				const { attribute } = action;
				const array = Array.isArray(attribute) ? attribute : [attribute];

				return {
					...state,
					attributes: state.attributes.withMutations(s => array.forEach(attr => s.set(attr.uuid, attr))),
				};
			}
		case AttributeActionType.Delete:
			{
				const { uuid } = action;
				const array = Array.isArray(uuid) ? uuid : [uuid];

				return {
					...state,
					attributes: state.attributes.withMutations(s => array.forEach(uuid => s.delete(uuid))),
				};
			}
		case AttributeActionType.SetLoadState:
			{
				const { state: loadState } = action;

				return {
					...state,
					loadState,
				};
			}
		default:
			return state;
	}
}