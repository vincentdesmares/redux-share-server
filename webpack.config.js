/* eslint-disable */

var path = require("path");
var webpack = require("webpack");
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


module.exports = [{
  devtool: "source-map",
  entry: {
    "lib-client":["./src/sync-redux-client"],
    "example-client":["webpack-hot-middleware/client" ,"./examples/client"]
  },
  target:'web',
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/dist/"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }, {
      test: /\.css$/,
      loaders: ["style", "raw"],
      include: __dirname
    }
    ]
  }
},
{
  entry: {
    "lib-server":["./src/sync-redux-server"],
    "example-server":"./examples/server"
  },
  devtool: 'inline-source-map',
  target:'node',
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/dist/"
  },
  externals:nodeModules,
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }, {
      test: /\.css$/,
      loaders: ["style", "raw"],
      include: __dirname
    }
    ]
  }
}



];
