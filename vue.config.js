

module.exports = {
  pwa: {
    name: 'AquaramaApp',
    themeColor: '#C3C5C5',
    workboxPluginMode: 'InjectManifest',
    manifestOptions: {
      display : 'fullscreen'
    },
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: './public/service-worker.js',

      // ...other Workbox options...
    }
  },
  configureWebpack: {
    plugins: [

    ]
  }

}