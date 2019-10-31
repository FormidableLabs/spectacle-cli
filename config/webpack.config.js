'use strict';

const path = require('path');

/**
 * Base configuration for the CLI, core, and examples.
 */

module.exports = {
  mode: 'development', // TODO: Adjust for production.
  entry: null, // TODO: Leave blank?
  output: {
    path: path.resolve(__dirname, '../dist'),
    pathinfo: true, // TODO: REMOVE
    filename: 'deck.min.js' // TODO: Do a different name???
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      {
        test: /\.mdx?$/,
        use: ['babel-loader', require.resolve('../webpack-mdx-loader')]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  // TODO: Remove these once using real published spectacle
  resolve: {
    alias: {
      react: require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
      // TODO: Sibling git repository hack. Replace with real spectacle.
      spectacle: require.resolve('../../spectacle')
    }
  }
};
