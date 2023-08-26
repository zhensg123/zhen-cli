exports.createAppType =  [
    {
      type: "list",
      name: "tool",
      message: "Select the package management tool you will use:",
      choices: ["npm", "yarn", "cnpm"],
    },
    {
      type: "list",
      name: "templateType",
      message: "Select the project template that you will use:",
      choices: ["template-vue2-js", "template-react-js", "template-express-js"],
    }
  ];