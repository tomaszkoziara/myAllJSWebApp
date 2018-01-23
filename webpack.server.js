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
        }])
    ]
};