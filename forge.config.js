module.exports = {
  plugins: [
    ['@electron-forge/plugin-webpack', {
      mainConfig: './webpack.main.config.js',
      renderer: {
        nodeIntegration: true,
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