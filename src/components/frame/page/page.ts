import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import mixin from "mixins/mixin";
import { DialogClient } from "mixins/dialog";

@Component
export default class Page extends mixin(Vue, DialogClient) { }