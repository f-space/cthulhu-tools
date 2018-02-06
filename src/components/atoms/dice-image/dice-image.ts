import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { DiceImageManager } from "models/resource";

@Component
export default class DiceImage extends Vue {
	@Prop({ required: true })
	public type: string;

	@Prop({ required: true })
	public face: number;

	public loaded: boolean = false;

	public get source(): string { return this.loaded ? DiceImageManager.get(this.type, this.face) : ""; }

	protected created(): void {
		DiceImageManager.load().then(() => { this.loaded = true });
	}
}
