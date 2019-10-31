'use strict';

const path = require('path');
const { promisify } = require('util');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseCfg = require('../config/webpack.config');

const launchDevServer = async ({ port, title, mdxFilePath, themeFilePath }) => {
  // TODO: Lots more stuff from original actions like title, etc.
  // TODO: Inject mdx, theme.
  const webpackCfg = webpack({
    ...baseCfg,
    mode: 'development', // TODO: Production option?
    context: process.cwd(),
    entry: path.resolve(__dirname, 'templates/mdx-slides/index.js'),
    output: {
      path: path.resolve('dist'), // TODO: Local `dist` best directory?
      pathinfo: true,
      filename: 'deck.js' // TODO: Different name?
    },
    plugins: [
      new HtmlWebpackPlugin({
        title,
        template: path.resolve(__dirname, 'templates/mdx-slides/index.html')
      })
    ]
  });
  const serverOpts = {
    hot: true
  };
  const server = new WebpackDevServer(webpackCfg, serverOpts);

  await promisify(server.listen.bind(server))(port, 'localhost');
};

module.exports = {
  launchDevServer
};
