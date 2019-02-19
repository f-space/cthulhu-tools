const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsConfigPlugin = require("./webpack-ext/tsconfig-webpack-plugin");
const SourceMapFixPlugin = require("./webpack-ext/source-map-fix-webpack-plugin");

const PACKAGE = require("./package.json");
const BASE_URL = PACKAGE.homepage;
const PUBLIC_PATH = `/${PACKAGE.name}/`;
const CONTENT_PATH = path.resolve(__dirname, "docs");

module.exports = function (env, { mode }) {

	const production = (mode === 'production');

	const cssLoaders = [
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
	];

	return {
		entry: {
			index: ["./src/index.tsx"],
		},
		output: {
			path: CONTENT_PATH,
			filename: "[name].js",
			publicPath: PUBLIC_PATH
		},
		module: {
			rules: [
				{
					test: /(?<!\.jsx)\.pug$/,
					loader: "pug-loader"
				},
				{
					test: /\.jsx\.pug$/,
					loader: "./webpack-ext/jsx-pug-loader"
				},
				{
					test: /\.[jt]sx?$/,
					exclude: /node_modules/,
					loader: "babel-loader"
				},
				{
					test: /\.scss$/,
					use: cssLoaders
				},
				{
					test: /(?<!\.(?:html|css|js))$/,
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
			extensions: [".tsx", ".ts", ".js", ".json"],
			alias: {
				"project": __dirname,
				"assets": CONTENT_PATH
			},
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
			contentBase: false,
			publicPath: PUBLIC_PATH,
			historyApiFallback: { index: `${PUBLIC_PATH}404.html` },
			https: {
				key: fs.readFileSync("ssl/server.key"),
				cert: fs.readFileSync("ssl/server.crt"),
			},
			after(app) {
				const express = require('express');
				app.use(PUBLIC_PATH, express.static(CONTENT_PATH));
			},
		},
		plugins: [
			new webpack.DefinePlugin({
				PUBLIC_PATH: JSON.stringify(PUBLIC_PATH)
			}),
			new MiniCssExtractPlugin({
				filename: "[name].css"
			}),
			new HtmlWebpackPlugin({
				filename: "404.html",
				template: "./src/index.pug",
				templateParameters: {
					process: { env: { NODE_ENV: mode } },
					baseUrl: BASE_URL,
					publicPath: PUBLIC_PATH,
				},
				inject: 'head'
			}),
			new ScriptExtHtmlWebpackPlugin({
				defaultAttribute: 'defer'
			}),
		]
	}
}