const parseArgs = require("minimist");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.prod");
const argv = parseArgs(process.argv.slice(2));
const { modern, env } = argv;

const createCompiler = config => {
  let compiler = webpack(config);
  return () => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err);
        console.log(stats.toString({ colors: true }) + "\n");
        resolve();
      });
    });
  };
};

const build = async () => {
  if (!modern) {
    // 构建生产环境普通包
    await createCompiler(webpackConfig(env, "common"))();
  } else {
    // 构建生产环境modern包
    await createCompiler(webpackConfig(env, "legacy"))();
    await createCompiler(webpackConfig(env, "modern"))();
  }
};

build();
