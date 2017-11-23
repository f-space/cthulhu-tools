import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Dialog extends Vue {
	@Prop()
	public title: string;
}