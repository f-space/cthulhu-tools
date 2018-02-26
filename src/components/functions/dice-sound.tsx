import React from 'react';
import { DiceSoundManager } from "models/resource";

export default class DiceSound extends React.Component {
	private element?: HTMLAudioElement;

	public constructor(props: any, context: any) {
		super(props, context);

		DiceSoundManager.load()
			.then(() => DiceSoundManager.player())
			.then(player => this.element = player);
	}

	public play() {
		if (this.element) {
			this.element.pause();
			this.element.currentTime = 0;
			this.element.play();
		}
	}

	public pause() {
		if (this.element) {
			this.element.pause();
		}
	}

	public render() { return null; }
}