const path = require('path')
const config = require('./webpack.common.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

config.mode = 'production';
// config.devtool = "source-map";
config.module.rules[2] = { 
  test: /\.css$/, 
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: "../",
      },
    },
    'css-loader',
  ],
};
config.plugins.push(new MiniCssExtractPlugin({
  filename: '[name].css'
}));

if (process.env.npm_config_report) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

config.plugins.push(new CleanWebpackPlugin());
config.plugins.push(new UglifyJsPlugin({
  uglifyOptions: {
    compress: {
        drop_console: true,  //删除所有console语句，可以兼容IE
        collapse_vars: true,  //内嵌已定义但只使用一次的变量
        reduce_vars: true,  //提取使用多次但没定义的静态值到变量
    },
    output: {
        beautify: false, //最紧凑的输出，不保留空格和制表符
        comments: false, //删除所有注释
    },
  }
}));

module.exports = config;
