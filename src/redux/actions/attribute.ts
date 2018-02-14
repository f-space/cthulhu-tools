import { Attribute } from "models/status";

export const ATTRIBUTE_SET = "attribute/set";
export const ATTRIBUTE_DELETE = "attribute/delete";

export interface AttributeSetAction {
	readonly type: typeof ATTRIBUTE_SET;
	readonly attribute: Attribute;
}

export interface AttributeDeleteAction {
	readonly type: typeof ATTRIBUTE_DELETE;
	readonly uuid: string;
}

export type AttributeAction = AttributeSetAction | AttributeDeleteAction;

export function setAttribute(attribute: Attribute): AttributeSetAction {
	return {
		type: ATTRIBUTE_SET,
		attribute,
	};
}

export function deleteAttribute(uuid: string): AttributeDeleteAction {
	return {
		type: ATTRIBUTE_DELETE,
		uuid,
	};
}