const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader')
const { default: WindiCSS } = require('windicss-webpack-plugin');

module.exports = [{
  entry: './src/main.ts',
  mode: 'development',
  target: 'electron-main',
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' },
    ]
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
}, {
  entry: './src/renderer.ts',
  mode: 'development',
  target: 'electron-renderer',
  devtool: 'inline-source-map',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.pug$/, loader: 'pug-plain-loader' },
      { test: /\.ts$/, use: 'ts-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.ya?ml$/, type: 'json', use: 'yaml-loader' },
      { test: /\.(eot|woff|woff2|svg|ttf)$/, type: 'asset/resource' },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ title: 'Emuera Toolbox' }),
    new VueLoaderPlugin(),
    new WindiCSS(),
  ]
}];