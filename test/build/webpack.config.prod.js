const merge = require("webpack-merge");
const baseConf = require("./webpack.config.base");
const webpack = require("webpack");
const { configureBabelLoader, getEnv } = require("./util");
const ModernBuildPlugin = require("./modernBuildPlugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const config = require("../app.config");
let browserslist = {
  legacy: ["> 1%", "last 2 versions", "not ie <= 8"],
  modern: [
    "last 2 Chrome versions",
    "not Chrome < 60",
    "last 2 Safari versions",
    "not Safari < 10.1",
    "last 2 iOS versions",
    "not iOS < 10.3",
    "last 2 Firefox versions",
    "not Firefox < 54",
    "last 2 Edge versions",
    "not Edge < 15"
  ]
}
Object.keys(config.browserslist).forEach(key =>{
  if(typeof config.browserslist[key] == 'string' ){
    browserslist[key] = [config.browserslist[key]]
  } else if(Array.isArray(config.browserslist[key])) {
    browserslist[key] = config.browserslist[key]
  }
})

/**
 * 返回生产环境的配置
 *
 * @param {String} env
 * @param {String} buildMode
 */
module.exports = function(env = "test", buildMode = "common") {
  // 如果不是合法的值，则默认使用test
  env = env === "prod" ? env : "test";

  // 如果不是不是合法的值，则默认使用common
  if (buildMode !== "legacy" && buildMode !== "modern") {
    buildMode = "common";
  }

  let filename = "js/[name].js";
  let plugins = [new OptimizeCSSPlugin(), new webpack.HashedModuleIdsPlugin()];

  // modern模式下，需要给构建的资源加上后缀
  let postfix = buildMode === "common" ? "" : `-${buildMode}`;
 
  // 生产环境需要加hash
  if (getEnv(env) === "prod") {
    filename = `js/[name]${postfix}.[chunkhash:8].js`;
    plugins.push(new ExtractTextPlugin("css/[name].[hash:8].css"));
  } else {
    filename = `js/[name]${postfix}.js`;
    plugins.push(new ExtractTextPlugin("css/[name].css"));
  }

  // 构建模式是modern时
  if (buildMode === "modern") {
    browserslist = browserslist.modern;
    plugins.push(
      new ModernBuildPlugin({ modern: true }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["**/*", "!js", "!js/*"]
      })
    );
  }

  // 构建模式是legacy时
  if (buildMode === "legacy") {
    browserslist = browserslist.legacy;
    plugins.push(
      new ModernBuildPlugin({ modern: false }),
      new CleanWebpackPlugin()
    );
  }
  // 构建模式是普通构建
  if (buildMode === "common") {
    plugins.push(new CleanWebpackPlugin());
  }
  
 // 配置babel-loader的浏览器
  let rules = [configureBabelLoader(browserslist)];
  const prodConf = {
    mode: "production",
    output: {
      filename
    },
    module: { rules },
    plugins,
    optimization: {
      runtimeChunk: "single"
    }
  };
  return merge(baseConf, prodConf);
};
