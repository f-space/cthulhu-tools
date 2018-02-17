import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class NavigationItem extends Vue {
	@Prop({ type: [String, Object], default: "" })
	public readonly to!: string | object;

	@Prop({ default: false })
	public readonly long!: boolean;
}