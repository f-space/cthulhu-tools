const path = require('path');
const { SourceMapConsumer, SourceMapGenerator } = require('source-map');

if (process.platform === 'win32') {
	const utils = require('source-map/lib/util');
	const { urlParse, normalize, join, isAbsolute, relative } = utils;

	utils.normalize = function (aPath) { return toPath(normalize.call(this, (toUrl(aPath)))); }
	utils.join = function (aRoot, aPath) { return toPath(join.call(this, toUrl(aRoot), toUrl(aPath))); }
	utils.isAbsolute = function (aPath) { return isAbsolute.call(this, aPath) || path.isAbsolute(aPath); }
	utils.relative = function (aRoot, aPath) { return toPath(relative.call(this, toUrl(aRoot), toUrl(aPath))); }

	function toUrl(p) {
		if (!isAbsolute(p)) {
			p = encodeURI(p.replace(/\\/g, "/"));
			return (path.isAbsolute(p) ? "/" + p : p);
		}
		return p;
	}

	function toPath(url) {
		if (!urlParse(url)) {
			url = decodeURI(url).replace(/\//g, "\\");
			return (url.charAt(0) === "\\" ? url.slice(1) : url);
		}
	}
}

module.exports = (function () {
	function SourceMapFixPlugin() {
		if (!new.target) {
			const SassLoader = require('sass-loader');

			const $this = this;
			const proxy = new Proxy(this, {
				get(target, key) {
					if (key === 'async') return function () {
						const callback = $this.async();
						return function (error, content, map, meta) {
							if (error == null) {
								map = fixSourceMap(content, map);
							}
							callback.call(this, error, content, map, meta);
						}
					}
					return target[key];
				}
			})

			SassLoader.apply(proxy, arguments);
		}
	}

	SourceMapFixPlugin.prototype.apply = function (resolver) {
		resolver.plugin('module', (request, callback) => {
			if (request.request === 'sass-loader') {
				const newRequest = Object.assign({}, request, { request: __filename });
				const message = "replace sass-loader";

				return resolver.doResolve('resolve', newRequest, message, callback);
			}

			return callback();
		});
	}

	function fixSourceMap(content, map) {
		if (map) {
			const consumer = new SourceMapConsumer(map);
			const generator = SourceMapGenerator.fromSourceMap(consumer);

			let previous = { source: map.sources[0], originalLine: 1, originalColumn: 0, generatedLine: 0 };
			consumer.eachMapping(mapping => {
				if (previous.generatedLine !== mapping.generatedLine) {
					for (let i = previous.generatedLine + 1; i < mapping.generatedLine; i++) {
						generator.addMapping({
							source: previous.source,
							original: { line: previous.originalLine, column: previous.originalColumn },
							generated: { line: i, column: 0 },
						});
					}
					if (mapping.generatedColumn !== 0) {
						generator.addMapping({
							source: mapping.source,
							original: { line: mapping.originalLine, column: mapping.originalColumn },
							generated: { line: mapping.generatedLine, column: 0 },
						})
					}
				}
				previous = mapping;
			});

			map = generator.toJSON();
		}

		return map;
	}

	return SourceMapFixPlugin;
})();