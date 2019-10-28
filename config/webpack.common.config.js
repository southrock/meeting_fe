const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin')

const paths = {
  src: path.resolve(__dirname, "../src"),
  build: path.resolve(__dirname, "../build"),
};

const devPaths = {
  components: path.resolve(paths.src,"components"),
  pages: path.resolve(paths.src,"pages"),
  assets: path.resolve(paths.src,"assets")
};

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: paths.build,
    publicPath: '/'
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: "babel-loader",
          options: { presets: ["react", "es2015"] }
        }],
      },
      { 
        test: /\.css$/, 
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif|webp)/,
        use: [{
          loader: "file-loader",
          options: {
            name: 'static/[name].[hash:5].[ext]',
            limit: 8192,
          }
        }],
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use:[{
          loader:'file-loader',
          options:{
            name:'static/[name].[hash:5].[ext]'
          }
        }],
      },
      {
        test: /\.(ico)$/,
        use:[{
          loader:'file-loader',
          options:{
            name:'[name].[ext]'
          }
        }],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({ template: './public/index.html',favicon: './public/favicon.ico', inject: true}),
  ]
};
