const path = require("path");

module.exports = {
	entry: "./js/page/root.js",
	output: {
		filename: "./main.js"
	},
	resolve: {
		modules: [
			path.resolve("./js"),
			"node_modules"
		]
	},
}