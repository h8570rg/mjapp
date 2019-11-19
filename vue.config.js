// module.exports = {
//   "publicPath": "/",
//   "transpileDependencies": [
//     "vuetify"
//   ]
// }

// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  "publicPath": "/",
  "transpileDependencies": [
    "vuetify"
  ],
  css: {
    extract: { ignoreOrder: true }
  }
  // configureWebpack: {
  //   plugins: [
  //     new VuetifyLoaderPlugin()
  //   ],
  // },
}