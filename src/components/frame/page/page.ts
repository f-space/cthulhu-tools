import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { DialogClient } from "vue-models/dialog";

@Component
export default class Page extends Vue.mixes(DialogClient) { }