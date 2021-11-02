module.exports = {
  plugins: [
    ['@electron-forge/plugin-webpack', {
      renderer: {
        // only load content we host
        nodeIntegration: true, 
        config: './webpack.renderer.config.js',
        entryPoints: [/* entry point config */]
      },
      mainConfig: './webpack.main.config.js',
      // other Webpack plugin config...
      renderer: {
        config: "./webpack.renderer.config.js",
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.js",
            name: "main_window",
            preload: {
              js: './src/preload.js'
            }
          }
        ]
      }
    }]
  ],
  makers: [
    {
      name: '@electron-forge/maker-zip'
    },
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "obs_status_electron"
      }
    },
    {
      name: '@electron-forge/maker-deb'
    },
    {
      name: '@electron-forge/maker-rpm'
    }
  ]
}