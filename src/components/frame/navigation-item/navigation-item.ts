import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class NavigationItem extends Vue {
	@Prop({ default: "" })
	public readonly to!: string;

	@Prop({ default: false })
	public readonly long!: boolean;
}