const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  },
  devServer: {
    proxy: {
      '/product-service': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: { '^/product-service': '/product-service' },
      },
    },
  },
  // devServer: {
  //   proxy: {
  //     '/order-service': {
  //       target: 'http://localhost:8080',
  //       changeOrigin: true,
  //       pathRewrite: { '^/order-service': '/order-service' },
  //     },
  //   },
  // },
})
