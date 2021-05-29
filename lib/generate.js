const Metalsmith = require("metalsmith");
const Handlebars = require("handlebars");
const async = require("async");
const render = require("consolidate").handlebars.render; //Template engine consolidation library.
const path = require("path");
const getOptions = require("./options");
const ask = require("./ask");
const filter = require("./filter");
/**
 * 创建项目
 *
 * @param {String} name 项目名
 * @param {String} src 模板所在目录
 * @param {String} dest 项目生成目录
 * @param {Function} done 创建完成后的回调
 */
// 核心代码
module.exports = function generate(name, src, dest, done) {
  // 获取模板中meta.js中的配置信息。
  const opts = getOptions(name, src);
  // 实例化Metalsmith，参数为其工作目录。 
  const metalsmith = Metalsmith(path.join(src, "template"));
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  });

  // 将模板中自定义的helper注册到handlebars中。
  opts.helpers &&
    Object.keys(opts.helpers).map(key => {
      Handlebars.registerHelper(key, opts.helpers[key]);
    });

  // 给metalsmith绑定插件，1.收集用户交互信息 2. 过滤需要渲染的文件 3. 渲染文件
  // metalsmith Read all the files in a source directory.
  // 将数据咋转为以路径为key的键值对形式
  metalsmith
    .use(askQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles)
    .clean(false)
    .source(".")
    .destination(dest)
    .build(err => {
      done(err);
      logMessage(opts.completeMessage, data);
    });

  return data;
};

/**
 * Create a middleware for asking questions.
 *
 * @param {Object} prompts
 * @return {Function}
 */

function askQuestions(prompts) {
  return (files, metalsmith, done) => {
    ask(prompts, metalsmith.metadata(), done);
  };
}

/**
 * Create a middleware for filtering files.
 *
 * @param {Object} filters
 * @return {Function}
 */

function filterFiles(filters) {
  return (files, metalsmith, done) => {
    filter(files, filters, metalsmith.metadata(), done);
  };
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function renderTemplateFiles(files, metalsmith, done) {
  const keys = Object.keys(files);
  const metalsmithMetadata = metalsmith.metadata();
  async.each(
    keys,
    (file, next) => {
      const str = files[file].contents.toString();
      // 如果文件中没有模板语法，则不对该文件进行渲染，直接输出文件内容。
      if (!/{{([^{}]+)}}/g.test(str)) {
        return next();
      }
      // 使用数据对象对模板进行渲染
      render(str, metalsmithMetadata, (err, res) => {
        if (err) {
          err.message = `[${file}] ${err.message}`;
          return next(err);
        }
        files[file].contents = Buffer.from(res);
        next();
      });
    },
    done
  );
}
/**
 * Display template complete message.
 *
 * @param {String} message
 * @param {Object} data
 */

function logMessage(message, data) {
  if (!message) return;
  render(message, data, (err, res) => {
    if (err) {
      console.error(
        '\n   渲染模板的 "completeMessage"时出错: ' + err.message.trim()
      );
    } else {
      console.log(
        "\n" +
          res
            .split(/\r?\n/g)
            .map(line => "   " + line)
            .join("\n")
      );
    }
  });
}
