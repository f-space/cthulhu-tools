import React from 'react';
import { DiceImageGuard } from "components/shared/templates/dice-image-guard";
import { DiceTemplate } from "./template";

export function DicePage() {
	return <DiceImageGuard>
		{() => <DiceTemplate />}
	</DiceImageGuard>
}