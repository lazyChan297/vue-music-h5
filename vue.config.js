const path = require('path')
const bodyParser = require('body-parser')
const compressionWebpackConfig = require('compression-webpack-plugin')
const axios = require('axios')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const externals = {
  'vue': 'Vue',
  'VueRouter': 'VueRouter',
  'Vuex': 'Vuex',
  'axios': 'axios'
}
const productionGzipExtensions = ['js', 'css'] // 定义压缩文件类型

module.exports = {
  devServer: {
    before (app) {
      app.get('/api/getDiscList', function (req, res) {
        const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      app.get('/api/getCdInfo', function (req, res) {
        const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      })

      app.get('/api/lyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          let ret = response.data
          if (typeof ret === 'string') {
            const reg = /^\w+\(({.+})\)$/
            const matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])
            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      })

      app.post('/api/getPurlUrl', bodyParser.json(), function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        axios.post(url, req.body, {
          headers: {
            referer: 'https://y.qq.com/',
            origin: 'https://y.qq.com',
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      app.get('/api/search', function (req, res) {
        const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          res.json(response.data)
        }).catch((e) => {
          console.log(e)
        })
      })

      app.get('/api/getTopBanner', function (req, res) {
        const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        const jumpPrefixMap = {
          10002: 'https://y.qq.com/n/yqq/album/',
          10014: 'https://y.qq.com/n/yqq/playlist/',
          10012: 'https://y.qq.com/n/yqq/mv/v/'
        }

        axios.get(url, {
          headers: {
            referer: 'https://u.y.qq.com/',
            host: 'u.y.qq.com'
          },
          params: req.query
        }).then((response) => {
          response = response.data
          if (response.code === 0) {
            const slider = []
            const content = response.focus.data && response.focus.data.content
            if (content) {
              for (let i = 0; i < content.length; i++) {
                const item = content[i]
                const sliderItem = {}
                const jumpPrefix = jumpPrefixMap[item.type || 10002]
                sliderItem.id = item.id
                sliderItem.linkUrl = jumpPrefix + item.jump_info.url + '.html'
                sliderItem.picUrl = item.pic_info.url
                slider.push(sliderItem)
              }
            }
            res.json({
              code: 0,
              data: {
                slider
              }
            })
          } else {
            res.json(response)
          }
        }).catch((e) => {
          console.log(e)
        })
      })
    }
  },
  productionSourceMap: false,
  configureWebpack: config => {
    config.externals = externals
    // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.plugins.push(
        new compressionWebpackConfig({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240, // threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
          minRatio: 0.8 // minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
        }),
        // 分析打包文件工具
        // new BundleAnalyzerPlugin() 
      )
  },
  pwa: {
    iconPaths: {
      favicon32: './public/favicon.ico',
      favicon16: './public/favicon.ico',
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue : 16, // 换算的基数
            propList   : ['*'],
        }),
        ]
      }
    }
  },
  chainWebpack (config) {
    // 打开preload，提高首屏加载速度
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    config.plugin('html').tap(args => {
      args[0].title = '297Music'
      return args
    })
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url-loader')
      .options({
        limit: 10000
      })
      .end()
    config
      .optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/base'), // can customize your rules
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
    config.optimization.runtimeChunk('single')
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'))
      .set('base', resolve('src/base'))
  },
  publicPath: './'
}
