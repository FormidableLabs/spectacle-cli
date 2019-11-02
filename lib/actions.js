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
const mdxTmpl = srcFilePath => `
// SPECTACLE_CLI_MDX_START
import slides, { notes } from '${srcFilePath}';
// SPECTACLE_CLI_MDX_END
`;

const MD_RE = /\/\/ SPECTACLE_CLI_MD_START[\s\S]*?\/\/ SPECTACLE_CLI_MD_END/gm;
const mdTmpl = mdContent => `
// SPECTACLE_CLI_MD_START
const mdContent = ${JSON.stringify(mdContent.toString())};
// SPECTACLE_CLI_MD_END
`;

const THEME_RE = /\/\/ SPECTACLE_CLI_THEME_START[\s\S]*?\/\/ SPECTACLE_CLI_THEME_END/gm;
const themeTmpl = themeFilePath => `
// SPECTACLE_CLI_THEME_START
import theme from '${themeFilePath}';
// SPECTACLE_CLI_THEME_END
`;

const TEMPLATE_RE = /\/\/ SPECTACLE_CLI_TEMPLATE_START[\s\S]*?\/\/ SPECTACLE_CLI_TEMPLATE_END/gm;
const templateTmpl = templateFilePath => `
// SPECTACLE_CLI_TEMPLATE_START
import template from '${templateFilePath}';
// SPECTACLE_CLI_TEMPLATE_END
`;

const AUTOLAYOUT_RE = /\/\/ SPECTACLE_CLI_AUTOLAYOUT_START[\s\S]*?\/\/ SPECTACLE_CLI_AUTOLAYOUT_END/gm;
const autolayoutTmpl = autolayout => `
  autoLayout: ${autolayout},
`;

const webpackConfig = async ({
  mode = 'development',
  title,
  srcFilePath,
  themeFilePath,
  templateFilePath,
  output,
  autoLayout
}) => {
  // Use a simplified "markdown only" template for `.md` files.
  const isMd = /\.md$/.test(srcFilePath);
  const tmplDir = `templates/${isMd ? 'md' : 'mdx'}-slides`;
  let mdContent;
  if (isMd) {
    mdContent = await readFile(srcFilePath);
  }

  // Webpack compiler + configuration.
  const entry = path.resolve(__dirname, `${tmplDir}/index.js`);
  const template = path.resolve(__dirname, `${tmplDir}/index.html`);

  return {
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
                  !isMd
                    ? { pattern: MDX_RE, replacement: mdxTmpl(srcFilePath) }
                    : null,
                  isMd
                    ? { pattern: MD_RE, replacement: mdTmpl(mdContent) }
                    : null,
                  {
                    pattern: AUTOLAYOUT_RE,
                    replacement: autolayoutTmpl(autoLayout)
                  },
                  templateFilePath
                    ? {
                        pattern: TEMPLATE_RE,
                        replacement: templateTmpl(templateFilePath)
                      }
                    : null,
                  themeFilePath
                    ? {
                        pattern: THEME_RE,
                        replacement: themeTmpl(themeFilePath)
                      }
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
      path: path.resolve(output || 'dist'),
      pathinfo: mode === 'development',
      filename: 'deck.js' // TODO: Different name?
    },
    plugins: [new HtmlWebpackPlugin({ title, template })]
  };
};

// Build output action.
const build = async ({
  title,
  srcFilePath,
  themeFilePath,
  templateFilePath,
  output,
  autoLayout
}) => {
  // TODO: Production mode produces a broken build (no slides found).
  const mode = 'development';
  const compiler = webpack(
    await webpackConfig({
      mode,
      title,
      srcFilePath,
      themeFilePath,
      templateFilePath,
      output,
      autoLayout
    })
  );

  return promisify(compiler.run.bind(compiler))();
};

// Dev server action.
const server = async ({
  port,
  title,
  srcFilePath,
  themeFilePath,
  templateFilePath,
  autoLayout
}) => {
  const compiler = webpack(
    await webpackConfig({
      title,
      srcFilePath,
      themeFilePath,
      templateFilePath,
      autoLayout
    })
  );
  const config = { hot: true };
  const devServer = new WebpackDevServer(compiler, config);

  return promisify(devServer.listen.bind(devServer))(port, 'localhost');
};

module.exports = {
  build,
  server
};
