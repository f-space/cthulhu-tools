import polyfill from "./polyfill";
import page from "./page";
import storage from "./storage";

import dice from "./dice";
import status from "./status";

document.addEventListener("DOMContentLoaded", () => {
	polyfill();
	page();
	storage();

	dice();
	status();
});