import { Module, Child } from "modules/vuex-class-module";
import ResourceModule from "modules/resource";
import StatusModule from "modules/status";

@Module
export default class RootModule {
	@Child
	public resource: ResourceModule;

	@Child
	public status: StatusModule;
}