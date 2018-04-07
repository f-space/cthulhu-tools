import { AttributeState, INITIAL_ATTRIBUTE_STATE } from "redux/states/attribute";
import { Action } from "redux/actions/root";
import { AttributeActionType } from "redux/actions/attribute";

export function AttributeReducer(state: AttributeState = INITIAL_ATTRIBUTE_STATE, action: Action): AttributeState {
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
		default:
			return state;
	}
}