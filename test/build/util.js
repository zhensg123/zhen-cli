const ExtractTextPlugin = require("extract-text-webpack-plugin");
/**
 * 配置URLLoader
 *
 * @param {String} env
 */
const configureURLLoader = env => {
  env = getEnv(env);
  let rules = [
    { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, type: "img" },
    { test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, type: "media" },
    { test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, type: "font" }
  ];
  return rules.map(rule => {
    let { type, test } = rule;
    let name =
      env === "prod" ? `${type}/[name].[hash:7].[ext]` : `${type}/[name].[ext]`;

    return {
      test,
      loader: "url-loader",
      options: {
        limit: 8092,
        name
      }
    };
  });
};

/**
 * 配置css-loader。生产环境下需要安装ExtractTextPlugin
 *
 * @param {String} env
 */
const configureCSSLoader = env => {
  let use =
    getEnv(env) === "prod"
      ? ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
        })
      : ["style-loader", "css-loader", "postcss-loader", "sass-loader"];
  return {
    test: /\.scss$/,
    exclude: /node_modules/,
    use
  };
};

/**
 * 配置babelloader
 *
 * @param {String} browserlist
 */
const configureBabelLoader = (browserlist = null) => {
  let options = {
    cacheDirectory: true
  };
  if (browserlist) {
    options = Object.assign(options, {
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false,
            corejs: "3.0.1",
            useBuiltIns: "usage",
            targets: {
              browsers: browserlist
            }
          }
        ]
      ]
    });
  }
  let babelLoader = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: ["thread-loader", { loader: "babel-loader", options }]
  };
  return babelLoader;
};
/**
 * 返回合法的环境值
 *
 * @param {String} env
 */
const getEnv = function(env) {
  if (env === "test" || env === "prod") {
    return env;
  }
  return "dev";
};

/**
 * 雪碧图模板函数
 *
 * @param {Object} data
 */
const templateFunction = function(data) {
  var shared = ".ico { background-image: url(I); background-size:Wpx Hpx;}"
    .replace("I", data.spritesheet.image)
    .replace("W", data.spritesheet.width / 2)
    .replace("H", data.spritesheet.height / 2);

  var perSprite = data.sprites
    .map(sprite => {
      return ".ico-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }"
        .replace("N", sprite.name)
        .replace("W", sprite.width / 2)
        .replace("H", sprite.height / 2)
        .replace("X", sprite.offset_x / 2)
        .replace("Y", sprite.offset_y / 2);
    })
    .join("\n");

  return shared + "\n" + perSprite;
};
module.exports = {
  getEnv,
  configureURLLoader,
  configureCSSLoader,
  configureBabelLoader,
  templateFunction
};
