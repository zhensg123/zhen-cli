const merge = require("webpack-merge");
const baseConf = require("./webpack.config.base");
const {configureBabelLoader } = require("./util");
const config = require("../app.config");
const path = require("path");
let devServer = {
  proxy: config.proxy || {},
  contentBase: path.resolve(__dirname, "../dist"),
  hot: true,
  clientLogLevel: "warning",
  compress: true,
  overlay: true,
  open: config.autoOpenBrowser || true,
  port: config.devServerport || 3000
};
module.exports = merge(baseConf, {
  mode: "development",
  devServer,
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
      },
      configureBabelLoader()
    ]
  }
});
