import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Mutation, namespace } from 'vuex-class';

const PageMutation = namespace("page", Mutation);

@Component
export default class CharacterManagementPage extends Vue {
	@PageMutation toCharacterEdit: () => void;
}