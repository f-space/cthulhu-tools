const presets = [
	[
		"@babel/env",
		{
			targets: { chrome: "41" },
			useBuiltIns: "usage",
		}
	],
	"@babel/preset-react",
	"@babel/preset-typescript",
];

const plugins = [
	"@babel/proposal-class-properties",
	"@babel/proposal-object-rest-spread",
];

module.exports = { presets, plugins };