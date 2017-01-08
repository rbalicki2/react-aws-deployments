import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const isProduction = (process.env.NODE_ENV === 'production');

export default {
  entry: [
    './src/index',
  ].concat(
    isProduction
      ? []
      : [
        'webpack/hot/only-dev-server',
        'webpack-dev-server/client?http://localhost:3000',
      ]
    ),
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    filename: 'static/bundle.js',
    path: path.resolve(path.join(__dirname, '/static')),
    publicPath: '/',
  },
  devtool: isProduction ? undefined : '#cheap-module-eval-source-map',
  module: {
    loaders: [

      // JS
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: (isProduction ? [] : ['react-hot'])
          .concat(['babel']),
      },

      // CSS loader
      { test: /\.css$/, loader: 'style!css' },

      // LESS
      { test: /\.less$/, loader: 'style!css!less' },

      // Font loader
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9].[0-9].[0-9])?$/,
        loader: 'file-loader?name=[name].[ext]',
      },

      // images
      { test: /\.(jpeg|png)$/, loader: 'file' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.tpl.html',
    }),
  ].concat(isProduction
    ? []
    : [new webpack.HotModuleReplacementPlugin()]
  ),
};
