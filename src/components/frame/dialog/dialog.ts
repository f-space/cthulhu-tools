import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Dialog as DialogBase } from "vue-models/dialog";

@Component
export default class Dialog<T> extends DialogBase<T> {
	@Prop()
	public readonly title!: string;
}