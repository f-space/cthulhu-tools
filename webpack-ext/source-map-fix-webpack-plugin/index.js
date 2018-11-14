const path = require('path');

module.exports = class SourceMapFixPlugin {
	apply(resolver) {
		extendSourceMapModule();
		replaceLoader(resolver, 'sass-loader');
		replaceLoader(resolver, 'postcss-loader');
	}
}

function replaceLoader(resolver, loader) {
	const target = resolver.ensureHook('resolve');
	resolver.getHook('module').tapAsync(__filename, (request, context, callback) => {
		if (request.request === loader) {
			const newRequest = { ...request, request: require.resolve(`./${loader}`) };
			const message = "replace base loader";

			return resolver.doResolve(target, newRequest, message, context, callback);
		}

		return callback();
	});
}

function extendSourceMapModule() {
	if (!extendSourceMapModule.done && process.platform === 'win32') {
		const utils = require('source-map/lib/util');
		const { urlParse, normalize, join, isAbsolute, relative } = utils;

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
			return url;
		}

		utils.normalize = function (aPath) { return toPath(normalize.call(this, (toUrl(aPath)))); }
		utils.join = function (aRoot, aPath) { return toPath(join.call(this, toUrl(aRoot), toUrl(aPath))); }
		utils.isAbsolute = function (aPath) { return isAbsolute.call(this, aPath) || path.isAbsolute(aPath); }
		utils.relative = function (aRoot, aPath) { return toPath(relative.call(this, toUrl(aRoot), toUrl(aPath))); }

		extendSourceMapModule.done = true;
	}
}