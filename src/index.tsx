import "index.scss";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from "components/frame/app";
import SERVICE_WORKER_PATH from "assets/service-worker.js";
import buildIconLibrary from "./build-falib";

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register(SERVICE_WORKER_PATH);
}

buildIconLibrary();

document.addEventListener("DOMContentLoaded", function () {
	const container = document.getElementById("app")!;
	const root = createRoot(container);
	root.render(<App />);
});