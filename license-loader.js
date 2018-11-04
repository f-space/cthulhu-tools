module.exports = function LicenseLoader(content, map, meta) {
	this.cacheable();

	try {
		const pList = content.trim().split(/(?:\r?\n){2,}/).map(p => p.trim());
		const json = JSON.stringify(pList);
		const result = `module.exports = ${json};`;

		this.callback(null, result, undefined, meta);
	} catch (e) {
		this.callback(e);
	}
}