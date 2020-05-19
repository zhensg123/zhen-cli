module.exports =  {
  // 配置dll入口
  dllEntry: {},
  // 静态资源的路径
  publicPath: "",
  // 资源输出目录，默认为dist
  outputDir: "dist",
  // 是否启用页面调试工具
  enableDebugTool: true,
  // 配置代理
  proxy: {},
  // 是否默认打开浏览器
  autoOpenBrowser: true,

  // devserver 默认端口号
  devServerport: 3000,
  mockServerPort: 8000,

  // 部署的服务器类型：ecs|oss。默认为oss
  deployType: "",

  // 只有当deployType为ecs时才需要配置该选项
  ECSAccount: {
    host: "",
    port: "",
    user: ""
  },

  // 只有当deployType为oss时才需要配置该选项
  ftpAccount: {
    host: "",
    port: "",
    user: "",
    password: ""
  },

  // 部署的目录
  deployDir: "",

  // 指定浏览器的范围
  browserslist: {
    legacy: "",
    modern: ""
  }
};
