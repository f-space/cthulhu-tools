import page from "./page";
import storage from "./storage";

import dice from "./dice";
import status from "./status";

document.addEventListener("DOMContentLoaded", () => {
	page();
	storage();

	dice();
	status();
});