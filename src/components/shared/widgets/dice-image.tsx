import React from 'react';
import classNames from 'classnames';
import { DiceDisplayType } from "models/dice";
import { DiceImageManager } from "models/resource";
import style from "./dice-image.scss";

export interface DiceImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	type: DiceDisplayType;
	face: number;
}

export class DiceImage extends React.Component<DiceImageProps> {
	private mounted: boolean = false;

	public componentDidMount(): void {
		this.mounted = true;

		if (!DiceImageManager.complete) {
			DiceImageManager.load().then(() => {
				if (this.mounted) this.forceUpdate()
			});
		}
	}

	public componentWillUnmount(): void {
		this.mounted = false;
	}

	public render() {
		const { type, face, className, ...rest } = this.props;
		const src = DiceImageManager.complete ? DiceImageManager.get(type, face) : "";

		return <img {...rest} className={classNames(className, style['dice-image'])} src={src} />
	}
}