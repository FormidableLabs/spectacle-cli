'use strict';

const path = require('path');
const { promisify } = require('util');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseCfg = require('../../config/webpack.config.cli');
const {
  MDX_RE,
  mdxTmpl,
  MD_RE,
  mdTmpl,
  THEME_RE,
  themeTmpl,
  TEMPLATE_RE,
  templateTmpl,
  AUTOLAYOUT_RE,
  autolayoutTmpl
} = require('../templates/replacements');

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
  const isMdx = /\.mdx$/.test(srcFilePath);
  const tmplDir = `../templates/${isMd ? 'md' : 'mdx'}-slides`;

  // Webpack compiler + configuration.
  const entry = path.resolve(__dirname, `${tmplDir}/index.js`);
  const template = path.resolve(__dirname, `${tmplDir}/index.html`);

  return {
    ...baseCfg,
    mode,
    // TODO(4): Add option to provide different context.
    // https://github.com/FormidableLabs/spectacle-cli/issues/4
    context: process.cwd(),
    entry,
    module: {
      ...baseCfg.module,
      rules: [
        {
          test: entry,
          use: [
            {
              loader: require.resolve('../webpack/inject-loader'),
              options: {
                replacements: [
                  isMd
                    ? { pattern: MD_RE, replacement: mdTmpl(srcFilePath) }
                    : null,
                  isMdx
                    ? { pattern: MDX_RE, replacement: mdxTmpl(srcFilePath) }
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
      // TODO(5): Allow user-specified output bundle name?
      // https://github.com/FormidableLabs/spectacle-cli/issues/5
      filename: `deck${mode === 'production' ? '.min' : ''}.js`
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
  const mode = 'production';
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
