const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const base = require('../../config/webpack.config.cli');

module.exports = {
  ...base,
  mode: 'development',
  context: __dirname,
  entry: './index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'example.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Spectacle MDX Development Example',
      template: `./index.html`
    })
  ]
};
