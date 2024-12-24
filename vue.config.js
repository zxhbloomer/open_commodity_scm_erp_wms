'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

const Timestamp = (new Date()).getTime()

function resolve (dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '管理后台' // page title

// 读取配置的api url
const api_url = process.env.VUE_APP_TEST_IP_PORT

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
const port = 19528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {

  // 打包的时候不使用hash值.因为我们有时间戳来确定项目的唯一性了.
  filenameHashing: false,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: true, // source map 调试非常有用，生产要关闭一下
  devServer: {
    port: port,
    open: true,
    hot: true, // 自动保存
    overlay: {
      warnings: false,
      errors: true
    },
    // upd by zxh
    // proxy: {
    //   // change xxx-api/login => mock/login
    //   // detail: https://cli.vuejs.org/config/#devserver-proxy
    //   [process.env.VUE_APP_BASE_API]: {
    //     target: `http://127.0.0.1:${port}/mock`,
    //     changeOrigin: true,
    //     pathRewrite: {
    //       ['^' + process.env.VUE_APP_BASE_API]: ''
    //     }
    //   }
    // },
    // after: require('./mock/mock-server.js')

    // proxy: 'http://127.0.0.1:8088/'
    proxy: {
      // wms后台端代理
      '/wms': {
        // target: 'http://127.0.0.1:8088/',
        target: `${api_url}`,
        proxyTimeout: 600000,
        ws: true,
        changeOrigin: true
      },
      // 文件系统后台端代理
      '/fs': {
        // target: 'http://127.0.0.1:8089/',
        // target: 'http://file.yirunscm.com/',
        target: process.env.VUE_APP_FILE_UPLOAD_URL,
        proxyTimeout: 55000,
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
      filename: `static/js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`,
      chunkFilename: `static/js/[name].${process.env.VUE_APP_Version}.${Timestamp}.js`
    },
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack (config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    // config
    //   // https://webpack.js.org/configuration/devtool/#development
    //   .when(process.env.NODE_ENV === 'development',
    //     config => config.devtool('cheap-source-map')
    //   )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
