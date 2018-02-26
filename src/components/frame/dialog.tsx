import { createComponents } from "hocs/slot";

export const DialogKey = `dialog-${Math.random().toString(16).substr(2, 8)}`;

export const {
	SlotProvider: DialogProvider,
	Slot: DialogSlot,
	SlotPortal: DialogPortal,
} = createComponents(DialogKey);