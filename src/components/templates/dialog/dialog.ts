import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Dialog<T> extends Vue {
	@Prop({ required: true })
	public readonly title!: string;
}