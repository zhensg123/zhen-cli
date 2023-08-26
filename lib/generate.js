const Metalsmith = require("metalsmith"); // 插件化的静态网站生成器
const Handlebars = require("handlebars");
const async = require("async");  // async这是一个异步处理的库
// 这里是用的handlebars模板 也可以使用ejs模板语法
const render = require("consolidate").handlebars.render; //Template engine consolidation library. 模板引擎库 有多种模板渲染引擎
const path = require("path");
const getOptions = require("./options");
const ask = require("./ask");
const filter = require("./filter");
const execa = require("execa"); // 使用代码执行命令 在这里执行的是npm install
// const boxen = require('boxen');
const chalk = require('chalk');

function createSuccessInfo(name) {
  const END_MSG = `${chalk.blue(
    "🎉 created project " + chalk.greenBright(name) + " Successfully"
  )}\n\n 🙏 Thanks for using zhen-cli !`;

  const BOXEN_CONFIG = {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    borderColor: "cyan",
    align: "center",
    borderStyle: "double",
    title: "🚀 Congratulations",
    titleAlignment: "center",
  };

  process.stdout.write(boxen(END_MSG, BOXEN_CONFIG));

//   console.log("👉 Get started with the following commands:");
//   console.log(`\n\r\r cd ${chalk.cyan(name)}`);
//   console.log(`\r\r ${tool} start \r\n`);
}
function executeCommand(command, cwd) {
  return new Promise((resolve, reject) => {
      const child = execa(command, [], {
          cwd,
          stdio: ['inherit', 'pipe', 'inherit'],
      })

      child.stdout.on('data', buffer => {
          // process.stdout.write(buffer)
      })

      child.on('close', code => {
          if (code !== 0) {
              reject(new Error(`command failed: ${command}`))
              return
          }

          resolve()
      })
  })
}
/**
 * 创建项目
 *
 * @param {String} name 项目名
 * @param {String} src 模板所在目录
 * @param {String} dest 项目生成目录
 * @param {Function} done 创建完成后的回调
 */
// 核心代码
module.exports = function generate(name, src, dest, tool, done) {
  // 获取模板中meta.js中的配置信息。
  const opts = getOptions(name, src);
  // 实例化Metalsmith，参数为其工作目录。 
//   Metalsmith works in three simple steps:

// Read all the files in a source directory.
// Invoke a series of plugins that manipulate the files.
// Write the results to a destination directory!
  const metalsmith = Metalsmith(path.join(src, "template"));
  // metalsmith.metadata() 这个默认是{}
  // console.log(metalsmith.metadata(), 'metalsmith.metadata()')
  const data = Object.assign(metalsmith.metadata(), {
    destDirName: name,
    inPlace: dest === process.cwd(),
    noEscape: true
  });

  // 将模板中自定义的helper注册到handlebars中。
  // helper实际就是模板可以自动获取到helper中的数据
  // opts.helpers &&
  //   Object.keys(opts.helpers).map(key => {
  //     Handlebars.registerHelper(key, opts.helpers[key]);
  //   });

  // 给metalsmith绑定插件，1.收集用户交互信息 2. 过滤需要渲染的文件 3. 渲染文件
  // metalsmith Read all the files in a source directory.
  // 将数据咋转为以路径为key的键值对形式
  // 输出到一个指定的目录
  metalsmith
    .use(askQuestions(opts.prompts))
    .use(filterFiles(opts.filters))
    .use(renderTemplateFiles)
    .clean(false)
    .source(".")
    .destination(dest)
    .build(err => {
      done(err);
      console.log('\n正在下载依赖...\n')
      const toolMap = {
        npm: 'npm install',
        cnpm: 'cnpm install',
        yarn: 'yarn'
      }
      executeCommand(toolMap[tool], path.join(process.cwd(), name)).then(()=>{
        // createSuccessInfo(name)
        logMessage(opts.completeMessage, data);
      })
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
  // metalsmithMetadata是meta里面的数据
  // console.log(metalsmithMetadata, 'metalsmithMetadata')
  async.each(
    keys,
    (file, next) => {
      const str = files[file].contents.toString();
      // 如果文件中没有模板语法，则不对该文件进行渲染，直接输出文件内容。
      if (!/{{([^{}]+)}}/g.test(str) || file.indexOf('.vue') > -1) {
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
            .map(line => "   " + line.trim().indexOf('To get started') > -1 ? chalk.green(line) : line )
            .join("\n")
      );
    }
  });
}
