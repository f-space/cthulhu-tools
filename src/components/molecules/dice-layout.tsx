import React from 'react';
import FlowDiceLayout, { FlowDiceLayoutProps } from "components/molecules/flow-dice-layout";
import CircleDiceLayout, { CircleDiceLayoutProps } from "components/molecules/circle-dice-layout";
import RowDiceLayout, { RowDiceLayoutProps } from "components/molecules/row-dice-layout";

export type DiceLayoutType = 'flow' | 'circle' | 'row';

export interface DiceLayoutProps extends FlowDiceLayoutProps, CircleDiceLayoutProps, RowDiceLayoutProps {
	type: DiceLayoutType;
}

export default function DiceLayout(props: DiceLayoutProps) {
	const { type, ...rest } = props;

	switch (type) {
		case 'flow': return <FlowDiceLayout  {...rest} />
		case 'circle': return <CircleDiceLayout  {...rest} />
		case 'row': return <RowDiceLayout  {...rest} />
		default: return null;
	}
}