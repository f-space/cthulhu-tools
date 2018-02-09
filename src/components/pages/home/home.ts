import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import Page from "vue-models/page";
import PageTemplate from "@component/templates/page";

@Component({ components: { PageTemplate } })
export default class HomePage extends Page { }