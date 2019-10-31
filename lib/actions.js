'use strict';

const { promisify } = require('util');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

// TODO: REENABLE const baseCfg = require("../config/webpack.config");
const baseCfg = require('../examples/loader-mdx/webpack.config');

const launchDevServer = async ({ port, title, mdxFilePath, themeFilePath }) => {
  // TODO: Review or document this.
  // Pin CWD to the context of the webpack `context` if provided.
  if (baseCfg.context) {
    process.chdir(baseCfg.context);
  }

  const webpackCfg = webpack({
    ...baseCfg
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
