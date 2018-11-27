import React from 'react';
import classNames from 'classnames';
import { DiceDisplayType } from "models/dice";
import { DiceImageStore } from "models/resource";
import style from "./dice-image.scss";

export interface DiceImageProps extends React.HTMLAttributes<HTMLElement> {
	store: DiceImageStore;
	type: DiceDisplayType;
	face: number;
}

export function DiceImage({ store, type, face, className, ...rest }: DiceImageProps) {
	const classList = classNames(className, style['dice-image']);
	const src = store.get(type, face)

	return <img {...rest} className={classList} src={src} />
}