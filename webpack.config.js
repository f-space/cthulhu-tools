const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SourceMapFixPlugin = require("./webpack-ext/source-map-fix-webpack-plugin");

const PACKAGE = require("./package.json");
const BASE_URL = PACKAGE.homepage;
const SRC_PATH = path.resolve(__dirname, "src");
const CONTENT_PATH = path.resolve(__dirname, "public");

module.exports = function (env, { mode }) {

	const production = (mode === 'production');

	const config = {
		stats: "minimal",
		entry: {
			index: ["./src/index.tsx"],
		},
		output: {
			path: CONTENT_PATH,
			filename: "[name].js",
			publicPath: "/",
		},
		module: {
			rules: [
				{
					test: /\.pug$/,
					loader: "pug-loader"
				},
				{
					test: /\.[jt]sx?$/,
					exclude: /node_modules/,
					loader: "babel-loader"
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								modules: true,
								importLoaders: 2,
								...(production ? {} : { sourceMap: true })
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
									path.resolve(__dirname, "src/styles")
								],
								...(production ? {} : { sourceMap: true })
							}
						}
					]
				},
				{
					include: [CONTENT_PATH],
					type: 'javascript/auto',
					loader: "file-loader",
					options: {
						name: "[path][name].[ext]",
						outputPath: url => path.relative(CONTENT_PATH, url).replace(/\\/g, "/"),
						emitFile: false
					}
				},
				{
					test: /LICENSE$/,
					loader: "./webpack-ext/license-loader",
				}
			]
		},
		resolve: {
			modules: [SRC_PATH, "node_modules"],
			extensions: [".tsx", ".ts", ".js", ".json"],
			alias: {
				"project": __dirname,
				"assets": CONTENT_PATH
			},
		},
		resolveLoader: {
			plugins: [
				new SourceMapFixPlugin()
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: "[name].css"
			}),
			new HtmlWebpackPlugin({
				template: "./src/index.pug",
				templateParameters: {
					process: { env: { NODE_ENV: mode } },
					baseUrl: BASE_URL,
				},
				inject: 'head'
			}),
			new ScriptExtHtmlWebpackPlugin({
				defaultAttribute: 'defer'
			}),
		]
	}

	if (env && env.serve) {
		Object.assign(config, {
			devServer: {
				contentBase: CONTENT_PATH,
				historyApiFallback: true,
				https: {
					key: fs.readFileSync("ssl/server.key"),
					cert: fs.readFileSync("ssl/server.crt"),
				},
			},
		});
	}

	return config;
}