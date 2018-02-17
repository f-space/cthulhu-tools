import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import NavigationItem from "@component/frame/navigation-item";

@Component({
	components: { NavigationItem },
})
export default class CharacterEditNav extends Vue { }