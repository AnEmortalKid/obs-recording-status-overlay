const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
  plugins: [
		new NodePolyfillPlugin()
	],
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.js',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  }
};
