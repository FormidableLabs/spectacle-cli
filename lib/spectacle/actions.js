'use strict';

const path = require('path');
const { promisify } = require('util');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseCfg = require('../../config/webpack.config.cli');
const {
  modes,
  themeRe,
  themeTmpl,
  themeDefault,
  templateRe,
  templateTmpl,
  templateDefault,
  getTmplDir
} = require('../templates/replacements');

const webpackConfig = async ({
  mode = 'development',
  title,
  srcFilePath,
  themeFilePath,
  templateFilePath,
  output
}) => {
  // Use a simplified "markdown only" template for `.md` files.
  const srcMode = path.extname(srcFilePath).replace('.', '');

  // Templates, examples from dependencies.
  const tmplDir = getTmplDir(srcMode);

  // Webpack compiler + configuration.
  const entry = path.join(tmplDir, 'index.js');
  const template = path.join(tmplDir, 'index.html');

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
                  {
                    pattern: modes[srcMode].re,
                    replacement: modes[srcMode].tmpl(srcFilePath)
                  },
                  // **Note**: If a user doesn't provide a template/theme file
                  // then we do an empty default value instead of whatever
                  // is originally in the example.
                  {
                    pattern: templateRe,
                    replacement: templateFilePath
                      ? templateTmpl(templateFilePath)
                      : templateDefault()
                  },
                  {
                    pattern: themeRe,
                    replacement: themeFilePath
                      ? themeTmpl(themeFilePath)
                      : themeDefault()
                  }
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
  output
}) => {
  const mode = 'production';
  const compiler = webpack(
    await webpackConfig({
      mode,
      title,
      srcFilePath,
      themeFilePath,
      templateFilePath,
      output
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
  templateFilePath
}) => {
  const compiler = webpack(
    await webpackConfig({
      title,
      srcFilePath,
      themeFilePath,
      templateFilePath
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
