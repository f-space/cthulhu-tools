import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class SelectableItem extends Vue {
	@Prop({ default: () => false })
	public readonly value: boolean;
}