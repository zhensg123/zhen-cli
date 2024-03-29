
const program = require("commander"); // 主要介绍版本以及设定命令
const chalk = require("chalk"); // chalk指定输出的颜色
const inquirer = require("inquirer"); // inquirer与命令行界面进行交互操作
const exists = require("fs").existsSync; //判断路径是否存在
const path = require("path");
const logger = require("./logger"); // logger日志输出

const generate = require("./generate");
const {createAppType} = require("./questions");
module.exports =  function executerTask() {
    /**
     * Help. 
     */

   program.on('--help', function () {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with a template'))
    console.log('    $ zhen create [projectName]')
    console.log()
  })

    /**
     * Help.如果只输入命令本身会返回帮助文档。
     */
    function help() {
        program.parse(process.argv);
        if (program.args.length < 1) return program.help();
    }
    help();

    /**
     * Settings.
     */
    // 项目名叫什么 第二个参数作为目录名
    const rawName = program.args[0];
    // 是否在当前目录 默认my-project
    const inPlace = rawName === ".";
    // 模板最终会下载到什么地方
    const to = path.resolve(rawName);

    process.on("exit", () => {
        console.log();
    });
    // 第一步：询问用户是否是在当前目录下创建项目; 如果要存放的目录已经存在提示已存在
    if (inPlace || exists(to)) {
        // 异步交互 和命令行工具进行交互 简单交互 如果是真则执行下一步 
        // inquirer这是一个简单功能
        inquirer
            .prompt([{
                type: "confirm",
                message: inPlace ? "在当前目录创建项目？" : "目录已经存在，仍要继续？",
                name: "ok"
            }])
            .then(answers => {
                if (answers.ok) {
                    run();
                }
            })
            .catch(logger.fatal);
    } else {
        // console.log(home, tmp, to)
        run();
    }

    async function  run() {
        const { tool, templateType } = await inquirer.prompt(
            createAppType
          );

        // 模板地址 获取上一级目录下指定文件
        const tmp = path.join(__dirname,'..', `./template/${templateType}`);
        generate(rawName, tmp, to, tool, err => {
            if (err) logger.fatal(err);
            logger.success(rawName);
        });
    }
}