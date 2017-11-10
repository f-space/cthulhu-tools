const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (env) {

	const production = env && env.production;

	const cssLoader = `css-loader?-url${production ? "&minimize" : "&sourceMap"}!sass-loader`;

	return {
		entry: {
			main: "./src/index.ts"
		},
		output: {
			path: path.resolve(__dirname, "docs"),
			filename: "[name].js"
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: "vue-loader",
					options: {
						loaders: {
							scss: ExtractTextPlugin.extract(cssLoader)
						},
					}
				},
				{
					test: /\.pug$/,
					loader: "pug-loader"
				},
				{
					test: /\.tsx?$/,
					loader: "ts-loader",
					options: {
						appendTsSuffixTo: [/\.vue$/]
					}
				}
			]
		},
		resolve: {
			extensions: [".ts", ".js", ".vue", ".json"],
			alias: {
				components: path.resolve(__dirname, "src/components")
			}
		},
		devServer: {
			contentBase: "docs"
		},
		plugins: [
			new ExtractTextPlugin("[name].css"),
			new HtmlWebpackPlugin({
				template: "./src/index.pug",
				inject: 'head',
				production: production
			}),
			...(production ? [new UglifyJSPlugin()] : [])
		]
	}
}