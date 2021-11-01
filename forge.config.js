module.exports = {
  plugins: [
    ['@electron-forge/plugin-webpack', {
      renderer: {
        nodeIntegration: true, // defaults to false
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
            name: "main_window"
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