const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TsConfigPlugin = require("./tsconfig-webpack-plugin");
const SourceMapFixPlugin = require("./source-map-fix-webpack-plugin");

module.exports = function (env) {

	const production = env && env.production;

	const cssLoader = [
		{
			loader: 'css-loader',
			options: {
				url: false,
				importLoaders: 2,
				...(production ? { minimize: true } : { sourceMap: true })
			}
		},
		{
			loader: 'postcss-loader',
			options: {
				...(production ? {} : { sourceMap: true })
			}
		},
		{
			loader: 'sass-loader',
			options: {
				includePaths: [
					path.resolve(__dirname, "src/scss")
				],
				...(production ? {} : { sourceMap: true })
			}
		}
	];

	return {
		entry: {
			main: ["./src/index.ts", "./src/index.scss"],
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
						appendTsSuffixTo: [/\.vue$/],
						compilerOptions: (production ? {} : { sourceMap: true })
					}
				},
				{
					test: /\.scss$/,
					loader: ExtractTextPlugin.extract(cssLoader)
				}
			]
		},
		resolve: {
			extensions: [".ts", ".js", ".vue", ".json"],
			plugins: [
				new TsConfigPlugin()
			]
		},
		resolveLoader: {
			plugins: [
				new SourceMapFixPlugin()
			]
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
			new ScriptExtHtmlWebpackPlugin({
				defaultAttribute: 'async'
			}),
			...(production ? [new UglifyJSPlugin()] : [new StylelintPlugin({ files: "src/**/*.scss" })])
		]
	}
}