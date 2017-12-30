import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class NavigationItem extends Vue {
	@Prop({ default: "" })
	public to: string;

	@Prop({ default: false })
	public long: boolean;
}