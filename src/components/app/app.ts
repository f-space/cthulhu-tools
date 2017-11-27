import Vue from 'vue';
import { Component, Provide } from 'vue-property-decorator';
import AppResource from "@component/resource";

@Component({
	components: {
		AppResource,
	}
})
export default class CthulhuApp extends Vue {
	@Provide()
	public app: CthulhuApp = this;

	public get resources(): AppResource { return this.$refs.resources as AppResource; }
}