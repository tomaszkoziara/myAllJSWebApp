const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path");

module.exports = {
    entry: [
        "babel-polyfill",
        "./src/server/index.js"
    ],
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    devtool: "source-map",
    output: {
        path: path.resolve("dist"),
        filename: "server.bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: ["babel-loader"], exclude: /node_modules/ }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: "#!/usr/bin/env node",
            raw: true
        }),
        new CopyWebpackPlugin([{
            from: "src/server.properties",
            to: "server.properties"
        }, {
            from: "src/server/pdf-assets",
            to: "pdf-assets"
        }, {
            from: "node_modules/phantomjs-prebuilt/lib/phantom/bin",
            to: "phantom/bin"
        }, {
            from: "node_modules/html-pdf/lib/scripts",
            to: "scripts"
        }, {
            from: "src/server/pdf-creator/CreateStream.js",
            to: "CreateStream.js"
        }])
    ]
};