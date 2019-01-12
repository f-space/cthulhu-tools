import "index.scss";
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "components/frame/app";
import buildIconLibrary from "./build-falib";

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register(PUBLIC_PATH + "service-worker.js");
}

buildIconLibrary();

document.addEventListener("DOMContentLoaded", function () {
	ReactDOM.render(<App />, document.getElementById("app"));
});