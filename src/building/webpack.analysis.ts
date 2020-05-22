import BaseConfig from "./webpack.config";
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


const Config = {
    ...BaseConfig,
    plugins: [
        ...BaseConfig.plugins,
        new BundleAnalyzerPlugin()
    ],
}

export default Config;
