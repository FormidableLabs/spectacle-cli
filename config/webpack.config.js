'use strict';

const path = require('path');

/**
 * Base configuration for the CLI, core, and examples.
 */

module.exports = {
  mode: 'development',
  entry: null, // TODO: Leave blank?
  output: {
    path: path.resolve(__dirname, '../dist'),
    pathinfo: true, // TODO: REMOVE
    filename: 'deck.min.js' // TODO: Do a different name???
  },
  devtool: 'source-map',
  module: {
    // Not we use `require.resolve` to make sure to use the loader installed
    // within _this_ project's `node_modules` traversal tree.
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'].map(require.resolve)
      },
      {
        test: /\.mdx?$/,
        use: ['babel-loader', '../webpack-mdx-loader'].map(require.resolve)
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'].map(require.resolve)
      }
    ]
  },
  resolve: {
    // TODO: Review if we actually need these aliases to avoid the dreaded
    // "two reacts" problem (`Invalid hook call. Hooks can only be called ...`).
    alias: {
      react: require.resolve('react'),
      'react-dom': require.resolve('react-dom')
    }
  }
};
