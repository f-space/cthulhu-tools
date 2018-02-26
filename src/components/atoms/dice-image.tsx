import React from 'react';
import classNames from 'classnames';
import { DiceDisplayType } from "models/dice";
import { DiceImageManager } from "models/resource";
import style from "styles/atoms/dice-image.scss";

export interface DiceImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	type: DiceDisplayType;
	face: number;
}

export default class DiceImage extends React.Component<DiceImageProps> {
	public constructor(props: DiceImageProps, context: any) {
		super(props, context);

		if (!DiceImageManager.complete) {
			DiceImageManager.load().then(() => this.forceUpdate());
		}
	}

	public render() {
		const { type, face, className, ...rest } = this.props;
		const src = DiceImageManager.complete ? DiceImageManager.get(type, face) : "";

		return <img {...rest} className={classNames(className, style['dice-image'])} src={src} />
	}
}