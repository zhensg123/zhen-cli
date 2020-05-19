// Karma configuration
var webpackConfig = require("../../build/webpack.config.test");
module.exports = function(config) {
  config.set({
    frameworks: ["mocha"],
    files: ["../../dll/*.js", "./index.js"],
    preprocessors: {
      "./index.js": ["webpack"]
    },
    browsers: ["Chrome"],
    webpack: webpackConfig,
    reporters: ["spec", "coverage"],
    port: 9876
  });
};
