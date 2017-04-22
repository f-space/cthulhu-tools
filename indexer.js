const fs = require('fs');

const MODEL_DIR = "script/model";
const VIEW_DIR = "script/view";
const INDEX_FILE = "__index__.ts";

function index(path, files) {
	const data = files
		.filter(file => file !== INDEX_FILE)
		.map(file => `/// <reference path="${file}"/>\n`)
		.join("");

	fs.writeFile(path, data, err => {
		if (err) console.log(err)
	});
}

fs.readdir(MODEL_DIR, (err, files) => {
	if (err) {
		console.log(err);
	} else {
		index(MODEL_DIR + "/" + INDEX_FILE, files);
	}
})

fs.readdir(VIEW_DIR, (err, files) => {
	if (err) {
		console.log(err);
	} else {
		index(VIEW_DIR + "/" + INDEX_FILE, files);
	}
})