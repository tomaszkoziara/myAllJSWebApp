const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const path = require("path");
const properties = require("./src/properties");

module.exports = {
    entry: [
        "babel-polyfill",
        "./src/client/index.js"
    ],
    target: "web",
    devtool: "source-map",
    output: {
        path: path.resolve("dist/www"),
        filename: "client.bundle.js"
    },
    module: {
        // loaders: [
        //     { test: /\.js$/, loader: ["babel-loader"], exclude: /node_modules/ },
        //     { test: /\.html$/, loader: ["html-loader"], exclude: /index.html/ },
        //     { test: /\.css$/, loaders: ["style-loader", "css-loader"] }
        // ]

        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: "html-loader",
                exclude: /index.html/
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]",
                    outputPath: "fonts/"
                }
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]",
                    outputPath: "images/"
                }
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: properties.appName,
            template: "src/client/index.html"
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            Popper: ["popper.js", "default"]
        }),
        new UglifyJsPlugin()
    ]
};