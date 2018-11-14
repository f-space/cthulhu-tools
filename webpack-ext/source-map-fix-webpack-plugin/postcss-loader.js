const path = require('path');
const { hookAfter } = require("./util");

module.exports = function (content, map) {
	require('postcss-loader').apply(hookAfter(this, function (error, content, map) {
		if (map && map.sources) {
			map.sources = map.sources
				.map(source => path.relative(path.dirname(this.resourcePath), source))
				.map(source => source.replace(/\\/g, "/"));
		}
	}), arguments);
}