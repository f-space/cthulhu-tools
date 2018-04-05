import { Attribute } from "models/status";

export type LoadState = 'unloaded' | 'loading' | 'loaded';

export enum AttributeActionType {
	Set = '[attribute]::set',
	Delete = '[attribute]::delete',
	SetLoadState = '[attribute]::setLoadState',
}

export interface AttributeSetAction {
	readonly type: AttributeActionType.Set;
	readonly attribute: Attribute | Attribute[];
}

export interface AttributeDeleteAction {
	readonly type: AttributeActionType.Delete;
	readonly uuid: string | string[];
}

export interface AttributeSetLoadStateAction {
	readonly type: AttributeActionType.SetLoadState;
	readonly state: LoadState;
}

export type AttributeAction =
	| AttributeSetAction
	| AttributeDeleteAction
	| AttributeSetLoadStateAction

export const AttributeAction = {
	set(attribute: Attribute | Attribute[]): AttributeSetAction {
		return { type: AttributeActionType.Set, attribute };
	},
	delete(uuid: string | string[]): AttributeDeleteAction {
		return { type: AttributeActionType.Delete, uuid };
	},
	setLoadState(state: LoadState): AttributeSetLoadStateAction {
		return { type: AttributeActionType.SetLoadState, state };
	},
}