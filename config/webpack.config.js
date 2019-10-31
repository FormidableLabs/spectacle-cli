const path = require('path');

/**
 * Base configuration for the CLI, core, and examples.
 */

module.exports = {
  mode: 'development', // TODO: Adjust for production.
  entry: null,  // TODO: Leave blank?
  output: {
    path: path.resolve(__dirname, '../dist'),
    pathinfo: true, // TODO: REMOVE
    filename: 'spectacle.min.js' // TODO: Do a different name???
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
      // TODO: MDX support.
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  }
};
