const rules = require('./webpack.rules');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  plugins: [
		new NodePolyfillPlugin()
	],
  // Put your normal webpack config below here
  module: {
    rules,
  }
};
