import * as path from 'path';
const WebpackManifestPlugin = require('webpack-manifest-plugin');

import Bundles from "./bundles";

const isProduction = process.env.NODE_ENV == "production";

const Config = {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "inline-source-map",
    //devtool: "inline-source-map",
    context: path.join(process.cwd(), 'src'),
    entry: Object.keys(Bundles.entires)
        .reduce((obj, key) => ({
            ...obj,
            [key]: path.join(process.cwd(), "src/client/", Bundles.entires[key as keyof typeof Bundles.entires])
        }), {}),
    output: {
        path: path.join(process.cwd(), "dist/www"),
        filename: isProduction ? "[name].[contenthash].js" : "[name].js"
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: { configFile: path.join(process.cwd(), "src/client/tsconfig.json") }
            }
        ],
    },
    plugins: [
        new WebpackManifestPlugin({
            generate: (seed: string, files: any) =>
                files.reduce((manifest: any, { name, path }: { name: string, path: string }) => ({ ...manifest, [name.substring(0, name.lastIndexOf("."))]: path }), seed)
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: Bundles.cacheGroups
        }
    },
    externals: {
        /* "react": "React",
        "react-dom": "ReactDOM",
        "styled-components": "styled" */
    },
};

export default Config;
