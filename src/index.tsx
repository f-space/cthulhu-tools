import "index.scss";
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "components/frame/app";
import SERVICE_WORKER_PATH from "assets/service-worker.js";
import buildIconLibrary from "./build-falib";

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register(SERVICE_WORKER_PATH);
}

buildIconLibrary();

document.addEventListener("DOMContentLoaded", function () {
	ReactDOM.render(<App />, document.getElementById("app"));
});