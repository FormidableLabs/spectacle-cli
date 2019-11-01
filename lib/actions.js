'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseCfg = require('../config/webpack.config');

const readFile = promisify(fs.readFile);

// Injection replacement patterns.
const MDX_RE = /\/\/ SPECTACLE_CLI_MDX_START[\s\S]*?\/\/ SPECTACLE_CLI_MDX_END/gm;
const mdxTmpl = mdxFilePath => `
// SPECTACLE_CLI_MDX_START
import slides, { notes } from '${mdxFilePath}';
// SPECTACLE_CLI_MDX_END
`;

// Dev server action.
const launchDevServer = async ({ port, title, mdxFilePath, themeFilePath }) => {
  // TODO: Lots more stuff from original actions like title, etc.
  // TODO: Inject mdx, theme.
  console.log('TODO HERE', { mdxFilePath, themeFilePath });

  // Use a simplified "markdown only" template for `.md` files.
  const isMd = /\.md$/.test(mdxFilePath);
  const tmplDir = `templates/${isMd ? 'md' : 'mdx'}-slides`;
  let mdContent;
  if (isMd) {
    mdContent = await readFile(mdxFilePath);
  }

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
                replacements: [
                  mdxFilePath
                    ? { pattern: MDX_RE, replacement: mdxTmpl(mdxFilePath) }
                    : null
                ].filter(Boolean)
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
