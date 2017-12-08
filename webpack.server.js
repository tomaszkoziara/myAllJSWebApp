const path = require("path");

module.exports = {
    entry: [
        "babel-polyfill",
        "./src/server/index.js"
    ],
    target: "node",
    devtool: "source-map",
    output: {
        path: path.resolve("dist"),
        filename: "server.bundle.js"
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ }
        ]
    }
};