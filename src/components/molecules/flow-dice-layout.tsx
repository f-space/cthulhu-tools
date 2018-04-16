import React from 'react';
import classNames from 'classnames';
import { DiceDisplay } from "models/dice";
import style from "styles/molecules/flow-dice-layout.scss";

export interface FlowDiceLayoutProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
	width: number;
	height: number;
	dices: DiceDisplay[][];
	render(group: DiceDisplay[]): React.ReactNode;
}

function Wrapper(props: { children?: React.ReactNode }) { return <>{props.children}</>; };

export default function FlowDiceLayout({ width, height, dices, render, className, ...rest }: FlowDiceLayoutProps) {
	const count = dices.reduce((sum, group) => sum + group.length, 0);
	const size = Math.floor(Math.sqrt((width * height) / count * 0.75));

	return <div {...rest} className={classNames(className, style['layout'])} style={{ '--dice-size': `${size}px` } as any}>
		{dices.map((group, index) => <Wrapper key={index}>{render(group)}</Wrapper>)}
	</div>
}