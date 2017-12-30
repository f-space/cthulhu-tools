import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import NavigationItem from "@component/navigation-item";

@Component({
	components: { NavigationItem },
})
export default class CharacterEditNav extends Vue { }