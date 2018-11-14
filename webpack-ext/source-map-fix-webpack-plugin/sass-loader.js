const path = require('path');
const { hookAfter } = require("./util");

module.exports = function () {
	require('sass-loader').apply(hookAfter(this, function (error, content, map) {
		if (map) {
			if (map.sources && map.sourceRoot) {
				map.sources = map.sources
					.map(source => path.resolve(map.sourceRoot, source))
					.map(source => path.relative(path.dirname(this.resourcePath), source))
					.map(source => source.replace(/\\/g, "/"));
				map.sourceRoot = "";
			}
		}
	}), arguments);
}