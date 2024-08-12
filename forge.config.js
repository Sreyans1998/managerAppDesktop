const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');



module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        author: "ZolonTech",
        description:"This is a manager app to check the data for analyst changes.",
        name: "manager-app",
        setupIcon: path.resolve(__dirname, "icon.ico"),
        shortcutName: "manager-app",
        noMsi: true,
        setupExe: "manager-app.exe"
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),

    // new WebpackPlugin({
    //   mainConfig: {
    //     entry: './src/index.js',
    //     output: {
    //       filename: 'bundle.js',
    //       path: path.resolve(__dirname, 'dist')
    //     },
    //     module: {
    //       rules: [
    //         {
    //           test: /\.(js|jsx)$/,
    //           exclude: /node_modules/,
    //           use: {
    //             loader: 'babel-loader'
    //           }
    //         },
    //       ]
    //     },
    //     resolve: {
    //       fallback: {
    //         "path": require.resolve("path-browserify"),
    //         "fs": require.resolve("browserify-fs"),
    //         "stream": require.resolve("stream-browserify")
    //       }
    //     }
    //   },
    //   renderer: {
    //     config: require('./webpack.renderer.config.js'), // Add this line to load the renderer config
    //     entryPoints: [
    //       {
    //         html: './public/index.html', // Adjust this path to your actual HTML file
    //         js: './src/index.js', // Adjust this path to your actual renderer JS file
    //         name: 'main_window',
    //       },
    //     ],
    //   },
    // }),
  ],
};
