module.exports = {
  helpers: {
    if_or(v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }
      return options.inverse(this);
    }
  },
  // 用户输入的信息
  prompts: {
    name: {
      type: "string",
      required: true,
      message: "项目名"
    },
    description: {
      type: "string",
      required: false,
      message: "项目描述",
      default: "react项目"
    },
    author: {
      type: "string",
      message: "Author",
      required: false,
      default: ""
    },
    // router: {
    //   type: "confirm",
    //   message: "是否安装vue-router？"
    // },
    // store: {
    //   type: "confirm",
    //   message: "是否安装vuex"
    // },
    // eslint: {
    //   type: "confirm",
    //   message: "是否使用 eslint？"
    // },
    // stylelint: {
    //   type: "confirm",
    //   message: "是否使用 stylelint？"
    // },
    // unit: {
    //   type: "confirm",
    //   message: "是否使用单元测试？"
    // },
    // e2e: {
    //   type: "confirm",
    //   message: "是否使用 e2e 测试？"
    // }
  },
  // 定义文件与功能选项之间的映射关系，如果用户没有选择对应的功能，则某些文件将不会渲染。
  filters: {
    // ".eslintrc.js": "eslint",
    // "eslint-config-kuaigou.js": "eslint",
    // ".stylelintrc.js": "stylelint",
    // "stylelint-config-kuaigou.js": "stylelint",
    // "build/webpack.config.test.js": "unit",
    // "test/unit/**/*": "unit",
    // "test/e2e/**/*": "e2e",
    // "src/router/**/*": "router",
    // "src/store/**/*": "store"
  },
  completeMessage:
    "{{#inPlace}}To get started:\n\n  npm install\n  npm start{{else}}To get started:\n\n  cd {{destDirName}}\n  npm run start{{/inPlace}}"
};
