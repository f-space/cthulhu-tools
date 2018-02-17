import { createSlotComponents } from "hocs/slot";

export const DialogKey = `dialog-${Math.random().toString(16).substr(2, 8)}`;

export const {
	Provider: DialogProvider,
	Slot: DialogSlot,
	Portal: DialogPortal,
} = createSlotComponents(DialogKey);