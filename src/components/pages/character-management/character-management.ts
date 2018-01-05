import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import AppPage from "@component/frame/page";

@Component({
	components: {
		AppPage,
	}
})
export default class CharacterManagementPage extends Vue { }