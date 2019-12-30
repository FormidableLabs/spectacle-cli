'use strict';

const path = require('path');
const { dependencies } = require('../package.json');
const baseCfg = require('./webpack.config');

/**
 * Base configuration for the CLI, core, and examples.
 */

module.exports = {
  ...baseCfg,
  entry: null, // Provided via CLI.
  plugins: [], // Provided via CLI. TODO(bp): REMOVE THIS???
  resolve: {
    // TODO(2): Review if we actually need these aliases to avoid the dreaded
    // "two reacts" problem (`Invalid hook call. Hooks can only be called ...`)
    // and other resolution issue.
    // https://github.com/FormidableLabs/spectacle-cli/issues/2
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
      .reduce(
        (memo, dep) => ({
          ...memo,
          [dep]: path.dirname(require.resolve(path.join(dep, 'package.json')))
        }),
        {}
      )
  }
};
