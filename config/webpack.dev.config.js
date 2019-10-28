const path = require('path')
const webpack = require('webpack');
const config = require('./webpack.common.config');
const host = process.env.HOST || '0.0.0.0';
config.mode = 'development';
config.devtool = "inline-source-map";
config.devServer = {
  hot: true,
  // contentBase: path.join(__dirname, "./dist"),
  open: true,
  // publicPath: '/dist/',
  port: 3000,
  host: host,
  historyApiFallback: true,
  disableHostCheck: true,
  proxy: {
    '/api': {
      target: 'https://2019hr.ncuos.com',
      changeOrigin: true,
    }
  }
}
config.plugins.push(new webpack.HotModuleReplacementPlugin());
module.exports = config;
