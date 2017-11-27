import { ModuleInterface, Store, SubModule } from "modules/vuex-class-module";
import PageModule from "modules/page";

@Store
export default class RootModule extends ModuleInterface {
	@SubModule
	public page: PageModule;
}