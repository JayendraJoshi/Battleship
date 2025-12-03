// webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
    devtool: 'source-map',

		module: {
			rules: [
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, 'css-loader'],
				},
			],
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css',
			}),
		],
	optimization: {
		minimize: true,
		minimizer: [
			'...', // extend existing minimizers (i.e. `terser-webpack-plugin`)
			new CssMinimizerPlugin(),
		],
	},
});
