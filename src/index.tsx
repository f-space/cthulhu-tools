import React from 'react';
import ReactDOM from 'react-dom';
import App from "components/frame/app";

if (document.readyState !== 'loading') {
	mount();
} else {
	document.addEventListener("DOMContentLoaded", mount);
}

function mount() {
	ReactDOM.render(<App />, document.getElementById("app"));
}