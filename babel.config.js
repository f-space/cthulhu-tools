const presets = [
	[
		"@babel/env",
		{
			targets: { chrome: "41" },
			useBuiltIns: "usage",
			modules: false,
		}
	],
];

module.exports = { presets };