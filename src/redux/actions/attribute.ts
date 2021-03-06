import { Attribute } from "models/status";

export enum AttributeActionType {
	Set = '[attribute]::set',
	Delete = '[attribute]::delete',
}

export interface AttributeSetAction {
	readonly type: AttributeActionType.Set;
	readonly attribute: Attribute | Attribute[];
}

export interface AttributeDeleteAction {
	readonly type: AttributeActionType.Delete;
	readonly uuid: string | string[];
}

export type AttributeAction =
	| AttributeSetAction
	| AttributeDeleteAction

export const AttributeAction = {
	set(attribute: Attribute | Attribute[]): AttributeSetAction {
		return { type: AttributeActionType.Set, attribute };
	},
	delete(uuid: string | string[]): AttributeDeleteAction {
		return { type: AttributeActionType.Delete, uuid };
	},
}