const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SourceMapFixPlugin = require("./webpack-ext/source-map-fix-webpack-plugin");

const PACKAGE = require("./package.json");
const BASE_URL = PACKAGE.homepage;
const SRC_PATH = path.resolve(__dirname, "src");
const CONTENT_PATH = path.resolve(__dirname, "public");

module.exports = function (_env, { mode }) {

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
								modules: {
									namedExport: false,
									exportLocalsConvention: 'as-is',
								},
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
								sassOptions: {
									loadPaths: [path.resolve(__dirname, "src/styles")],
									silenceDeprecations: ["slash-div", "color-functions", "import", "global-builtin"],
								},
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
						emitFile: false,
						esModule: false,
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
		],
		devServer: {
			static: CONTENT_PATH,
			historyApiFallback: true,
		},
	};

	return config;
};