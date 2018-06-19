"use strict";

const fs = require("fs");
const path = require("path");

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",

    // The entry point tells webpack where to start
    // and follows the graph of dependencies to know what to bundle.
    entry: {
        "application": path.resolve(__dirname, "bundles/application.tsx"),
        "controller": path.resolve(__dirname, "bundles/controller.tsx"),
        "display": path.resolve(__dirname, "bundles/display.tsx"),

    },

    output: {
        path: path.resolve(__dirname, "../../services/server/static/app"),
        filename: "[name].js"
    },

    // Enable source maps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        modules: [
            path.resolve(__dirname, "../shared"),
            "node_modules"
        ],

        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            allChunks: true
        })
    ],

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },

            // All SCSS files will be converted to CSS and concatenated.
            //{ test: /\.scss$/, loaders: ['style', 'css', 'sass'] }
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "three": "THREE"
    }
};
