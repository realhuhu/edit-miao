const Components = require('unplugin-vue-components/webpack')
const {VarletUIResolver} = require('unplugin-vue-components/resolvers')

module.exports = {
  publicPath: '/',
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "components": "@/components",
      }
    },
    plugins: [
      Components({
        resolvers: [VarletUIResolver()]
      })
    ]
  }
}
