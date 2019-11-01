'use strict';

const path = require('path');
const { promisify } = require('util');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseCfg = require('../config/webpack.config');

const launchDevServer = ({ port, title, mdxFilePath, themeFilePath }) => {
  // TODO: Lots more stuff from original actions like title, etc.
  // TODO: Inject mdx, theme.
  console.log('TODO HERE', { mdxFilePath, themeFilePath });

  // Use a simplified "markdown only" template for `.md` files.
  const tmplDir = /\.md$/.test(mdxFilePath)
    ? 'templates/md-slides'
    : 'templates/mdx-slides';

  // Webpack compiler + configuration.
  const mode = 'development'; // TODO: Production option?
  const entry = path.resolve(__dirname, `${tmplDir}/index.js`);
  const template = path.resolve(__dirname, `${tmplDir}/index.html`);
  const compiler = webpack({
    ...baseCfg,
    mode,
    context: process.cwd(), // TODO: Re-evaluate this or option?
    entry,
    module: {
      ...baseCfg.module,
      rules: [
        {
          test: entry,
          use: [
            {
              loader: require.resolve('./webpack/inject-loader'),
              options: {
                mdxFilePath,
                themeFilePath
              }
            }
          ]
        },
        ...baseCfg.module.rules
      ]
    },
    output: {
      path: path.resolve('dist'), // TODO: Local `dist` best directory? Option?
      pathinfo: mode === 'development',
      filename: 'deck.js' // TODO: Different name?
    },
    plugins: [new HtmlWebpackPlugin({ title, template })]
  });

  // WDS configuration.
  const config = {
    hot: true
  };

  const server = new WebpackDevServer(compiler, config);
  return promisify(server.listen.bind(server))(port, 'localhost');
};

module.exports = {
  launchDevServer
};
