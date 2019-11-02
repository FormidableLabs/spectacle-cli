'use strict';

const path = require('path');
const { dependencies } = require('../package.json');

// Customized babel loader with the minimum we need to get `mdx` libraries
// working, which unfortunately codegen JSX instead of JS.
const babelLoader = {
  loader: require.resolve('babel-loader'),
  options: {
    // Use user-provided .babelrc
    babelrc: true,
    // ... with some additional needed options.
    presets: [require.resolve('@babel/preset-react')]
  }
};

/**
 * Base configuration for the CLI, core, and examples.
 */

module.exports = {
  mode: 'development',
  entry: null,
  output: {
    path: path.resolve('dist'),
    filename: 'deck.js'
  },
  devtool: 'source-map',
  module: {
    // Not we use `require.resolve` to make sure to use the loader installed
    // within _this_ project's `node_modules` traversal tree.
    rules: [
      {
        test: /\.jsx?$/,
        use: [babelLoader]
      },
      {
        test: /\.mdx?$/,
        use: [babelLoader, require.resolve('../webpack-mdx-loader')]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [require.resolve('file-loader')]
      }
    ]
  },
  resolve: {
    // TODO(2): Review if we actually need these aliases to avoid the dreaded
    // "two reacts" problem (`Invalid hook call. Hooks can only be called ...`)
    // and other resolution issue.
    // https://github.com/FormidableLabs/spectacle-cli/issues/2
    //
    //
    // Use all of the CLIs production dependencies over anything else found
    // in a user deck.
    alias: Object.keys(dependencies)
      // Remove node-only prod deps.
      .filter(
        dep =>
          !(
            dep.startsWith('@babel') ||
            dep.indexOf('webpack') > -1 ||
            dep.endsWith('loader')
          )
      )
      // Create alias object.
      .reduce((memo, dep) => ({ ...memo, [dep]: require.resolve(dep) }), {})
  }
};
