const path = require('path');

module.exports = () => {

	const browsers = ["Chrome", "Firefox", "Edge", "ChromeAndroid", "iOS"].map(x => `last 2 ${x} versions`).join(",");

	return {
		plugins: [
			require('autoprefixer')({ browsers, remove: false }),
		]
	}
}