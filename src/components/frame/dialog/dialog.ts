import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Dialog as DialogBase } from "mixins/dialog";

@Component
export default class Dialog<T> extends DialogBase<T> {
	@Prop()
	public title: string;
}