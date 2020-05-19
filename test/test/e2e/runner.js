// 1. start the dev server using production config
const webpack = require("webpack");
const DevServer = require("webpack-dev-server");
const devConfig = require("../../build/webpack.config.dev");

const devServerOptions = devConfig.devServer;
const compiler = webpack(devConfig);
let server = new DevServer(compiler, devServerOptions);
const port = devServerOptions.port;
const host = devServerOptions.host;
server.listen(port, host, () => {
  let opts = process.argv.slice(2);
  if (opts.indexOf("--config") === -1) {
    opts = opts.concat(["--config", "test/e2e/nightwatch.conf.js"]);
  }

  const spawn = require("cross-spawn");
  const runner = spawn("./node_modules/.bin/nightwatch", opts, {
    stdio: "inherit"
  });

  runner.on("exit", function(code) {
    server.close();
    process.exit(code);
  });

  runner.on("error", function(err) {
    server.close();
    throw err;
  });
});
