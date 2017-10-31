const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { LoaderOptionsPlugin } = require('webpack');

module.exports = {
	entry: {
		css: "./scss/main.scss",
		js: "./ts/page/root.ts"
	},
	output: {
		path: path.resolve(__dirname, "docs"),
		filename: "main.[name]"
	},
	module: {
		rules: [
			{
				test: /\.s?css$/,
				loader: ExtractTextPlugin.extract("css-loader?-url!sass-loader")
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader"
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js", ".json"],
		modules: [
			path.resolve(__dirname, "ts"),
			"node_modules"
		]
	},
	devServer: {
		contentBase: "docs"
	},
	plugins: [
		new ExtractTextPlugin("main.css"),
	]
}

if (!process.argv.includes("--debug")) {
	module.exports.plugins = (module.exports.plugins || []).concat([
		new UglifyJSPlugin(),
		new LoaderOptionsPlugin({ minimize: true })
	]);
}