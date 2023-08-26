#!/usr/bin/env node

const program = require("commander"); // 主要介绍版本以及设定命令
const chalk = require("chalk"); // chalk指定输出的颜色
const inquirer = require("inquirer"); // inquirer与命令行界面进行交互操作
const download = require("download-git-repo"); // 下载github下的仓库
const exists = require("fs").existsSync; //判断路径是否存在
const rm = require("rimraf").sync; // rimraf删除指定文件
const path = require("path");
const logger = require("./logger"); // logger日志输出
const {
    isLocalPath,
    getTemplatePath
} = require("./local-path");
const generate = require("./generate");
const ora = require("ora");
module.exports = function executerTask({template, log}) {

   
    program
        .usage("[project-name]")
        .option("-c, --clone", "use git clone");
    /**
     * Help.
     */
    program.on("--help", () => {
        console.log("  示例:");
        console.log();
        console.log(chalk.gray("    # 使用模板创建项目"));
        console.log(log);
        console.log();
    });

    /**
     * Help.如果只输入命令本身也会返回帮助文档。
     */
    function help() {
        program.parse(process.argv);
        if (program.args.length < 1) return program.help();
    }
    help();

    /**
     * Settings.
     */
    // 模板名是什么
    // let type = program.args[0]; // 后面可以使用vue-cli类别
    // 项目名叫什么 第二个参数作为目录名
    const rawName = program.args[0];
    // 是否在当前目录
    const inPlace = !rawName || rawName === ".";
    // 最终经过计算得到的项目名
    const name = inPlace ? path.relative("../", process.cwd()) : rawName;
    // 模板最终会下载到什么地方
    const to = path.resolve(rawName || ".");
    // 是否使用git clone来下载私有仓库
    // const clone = program.clone || false;
    // 模板的暂存目录
    const home = require("user-home"); // 得到用户的主目录
    // 模板地址 获取上一级目录下指定文件
    const tmp = path.join(__dirname,'..', `./template/${template}`);
    // console.log(home, tmp, to)
    /**
     * Padding.
     */

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
        run();
    }

    /**
     * Check, download and generate the project.
     */

    function run() {
        generate(name, tmp, to, err => {
            if (err) logger.fatal(err);
            logger.success('"%s" 创建成功.', name);
        });
    }
}