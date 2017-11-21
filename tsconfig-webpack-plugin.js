const fs = require('fs');
const path = require('path');

function normalize(p) {
	const normalized = path.normalize(p);
	return (process.platform === 'win32' ? normalized.replace(/\\/g, '/') : normalized);
}

function byTs(pattern, request) {
	return pattern.test(request.context.issuer);
}

function expandOptions(options) {
	if (typeof options === "string") {
		return expandOptions({ config: options });
	} else if (typeof options !== "object" || options === null) {
		return expandOptions({});
	} else if (typeof options.config !== "string" && options.config !== null) {
		return expandOptions(Object.assign(options, { config: "tsconfig.json" }))
	}

	if (options.config !== null && !options.loaded) {
		options.options = Object.assign(loadTsCompilerOptions(options.config), options.options);
		options.loaded = true;
	} else {
		options.options = options.options || {};
	}
	options.test = RegExp(options.test || /.tsx?$/);

	return options;
}

function loadTsCompilerOptions(path) {
	if (fs.existsSync(path)) {
		const config = fs.readFileSync(path, { encoding: 'utf8' });
		const json = JSON.parse(config);
		const options = json && json.compilerOptions;
		return options || {};
	} else {
		throw new Error(`'${path}' not found.`);
	}
}

class TsBaseUrlPlugin {
	constructor(options) {
		this.options = expandOptions(options);

		const { baseUrl } = this.options.options;
		this.baseUrl = (typeof baseUrl === 'string') ? normalize(baseUrl) : "";
	}

	apply(resolver) {
		if (this.baseUrl) {
			const configPath = this.options.config ? path.resolve(this.options.config) : ".";
			const root = normalize(path.resolve(path.dirname(configPath), this.baseUrl));

			resolver.plugin('module', (request, callback) => {
				if (byTs(this.options.test, request)) {
					const newRequest = Object.assign({}, request, { path: root, request: "./" + request.request });
					const message = `looking for modules in ${root}`;

					return resolver.doResolve('resolve', newRequest, message, callback);
				}

				return callback();
			});
		}
	}
}

class TsPathsPlugin {
	constructor(options) {
		this.options = expandOptions(options);

		const { paths } = this.options.options;
		this.mappings = this.makeMapping(paths);
	}

	apply(resolver) {
		for (const { pattern, replacement } of this.mappings) {
			resolver.plugin('described-resolve', (request, callback) => {
				if (byTs(this.options.test, request)) {
					const innerRequest = request.request;
					if (innerRequest && match(innerRequest, pattern)) {
						const newInnerRequest = replace(capture(innerRequest, pattern), replacement)
						const newRequest = Object.assign({}, request, { request: newInnerRequest, });
						const message = `aliased with mapping '${innerRequest}': '${toString(pattern)}' to '${toString(replacement)}'`;

						return resolver.doResolve('resolve', newRequest, message, callback);
					}
				}

				return callback();
			});
		}

		function match(path, { prefix, suffix }) {
			return (path.length >= prefix.length + suffix.length && path.startsWith(prefix) && path.endsWith(suffix));
		}

		function capture(path, { prefix, suffix }) {
			return path.substr(prefix.length, path.length - (prefix.length + suffix.length));
		}

		function replace(captured, { prefix, suffix }) {
			return prefix + captured + suffix;
		}

		function toString({ prefix, suffix }) {
			return `${prefix}*${suffix}`;
		}
	}

	makeMapping(paths = {}) {
		const mappings = []
		for (const [key, values] of Object.entries(paths)) {
			const [patternPrefix, patternSuffix] = key.split("*", 2);
			if (Array.isArray(values)) {
				for (const value of values) {
					if (typeof value === 'string') {
						const [replacementPrefix, replacementSuffix] = value.split("*", 2);
						mappings.push({
							pattern: {
								prefix: patternPrefix || "",
								suffix: patternSuffix || "",
							},
							replacement: {
								prefix: replacementPrefix || "",
								suffix: replacementSuffix || "",
							},
						});
					}
				}
			}
		}

		return mappings;
	}
}

class TsRootDirsPlugin {
	constructor(options) {
		this.options = expandOptions(options);

		const { rootDirs } = this.options.options;
		this.rootDirs = (rootDirs || []).filter(dir => typeof dir === 'string').map(dir => normalize(dir));
	}

	apply(resolver) {
		const roots = this.rootDirs.map(dir => normalize(path.resolve(dir)));
		for (const root of roots) {
			resolver.plugin('described-resolve', (request, callback) => {
				if (byTs(this.options.test, request)) {
					const innerRequest = request.request;
					if (innerRequest && isRelative(innerRequest)) {
						const absolutePath = normalize(path.join(request.path, innerRequest));
						const matchedRoot = roots.find(root => absolutePath.startsWith(root));
						if (matchedRoot && matchedRoot !== root) {
							const newInnerRequest = normalize(path.resolve(root, path.relative(matchedRoot, absolutePath)));
							const newRequest = Object.assign({}, request, { request: newInnerRequest, });
							const message = `looking for modules in ${root}`;

							return resolver.doResolve('resolve', newRequest, message, callback);
						}
					}
				}

				return callback();
			});
		}

		function isRelative(p) {
			return /^\.\.?$|^\.\.?\//.test(p);
		}
	}
}

class TsConfigPlugin {
	constructor(options) {
		this.options = expandOptions(options);

		this.plugins = [
			new TsBaseUrlPlugin(this.options),
			new TsPathsPlugin(this.options),
			new TsRootDirsPlugin(this.options),
		];
	}

	apply(resolver) {
		for (const plugin of this.plugins) {
			plugin.apply(resolver);
		}
	}
}

module.exports = TsConfigPlugin;
module.exports.TsBaseUrlPlugin = TsBaseUrlPlugin;
module.exports.TsPathsPlugin = TsPathsPlugin;
module.exports.TsRootDirsPlugin = TsRootDirsPlugin;