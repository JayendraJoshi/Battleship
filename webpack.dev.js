// webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // Add development-specific settings here
  devServer: {
    static: './dist',
    port: 8080,
    open: true,
    hot: true,
    watchFiles: ['src/template.html'],
  },
});
