/* eslint-env node */
var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    entry: {
        app: ["babel-polyfill", path.resolve(__dirname, "src", "main.js")],
        vendor: ["phaser"]
    },
    devtool: "cheap-source-map",
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, "dist"),
        library: "[name]",
        libraryTarget: "umd",
        filename: "[name].js"
    },
    watch: true,
    plugins: [
        new CleanWebpackPlugin("dist"),
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(
                JSON.parse(process.env.BUILD_DEV || "true")
            ),
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "index.html",
            chunks: ["vendor", "app"],
            chunksSortMode: "manual",
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || "localhost",
            port: process.env.PORT || 3000,
            server: { baseDir: ["./dist"] }
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "assets"),
                to: path.resolve(__dirname, "dist", "assets")
            }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
                include: path.join(__dirname, "src")
            },
            { test: /phaser-split\.js$/, use: ["expose-loader?Phaser"] },
            { test: [/\.vert$/, /\.frag$/], use: "raw-loader" }
        ]
    }
};
