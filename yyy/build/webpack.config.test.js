const merge = require("webpack-merge");
const baseConf = require("./webpack.config.base");
const { configureBabelLoader } = require("./util");

let testConf = merge(baseConf, {
  devtool: "inline-source-map",
  module: {
    rules: [configureBabelLoader()]
  }
});
delete testConf.entry;
module.exports = testConf;
