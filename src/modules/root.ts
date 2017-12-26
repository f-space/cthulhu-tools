import { Module, Child } from "modules/vuex-class-module";
import ResourceModule from "modules/resource";

@Module
export default class RootModule {
	@Child
	public resource: ResourceModule;
}