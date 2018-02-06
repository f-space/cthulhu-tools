import { Module, Child } from "modules/vuex-class-module";
import StatusModule from "modules/status";

@Module
export default class RootModule {
	@Child
	public status: StatusModule;
}