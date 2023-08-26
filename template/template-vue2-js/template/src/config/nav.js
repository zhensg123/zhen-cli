const files = require.context('../router/modules', false, /\.js$/)

let configRoutes = []
/**
 * inject routers
 */
files
  .keys()
  .forEach(key => {
    configRoutes = configRoutes
      .concat(files(key).default)
      // .sort((a, b) => (a.sort ? a.sort - b.sort : -1)) // 读取出文件中的default模块
  })

const menus = {
  mywork: {
    name: '我的工作',
    icon: 'icon-wodegongzuo'
  }
}
const menuArr = Object.keys(menus).map((menu) => {
  const { name, icon } = menus[menu]
  const temp = {
    menu: name,
    icon,
    children: configRoutes.filter((route) => route.name === menu)
  }
  return temp
})

export default menuArr

  