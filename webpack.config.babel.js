import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import childProcess from 'child_process';

const isProduction = (process.env.NODE_ENV === 'production');

const getGitRev = () => process.env.CIRCLE_SHA1
  || childProcess.execSync('git rev-parse HEAD').toString().trim();

const staticFolder = isProduction
  ? getGitRev()
  : 'static';

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
    filename: path.join(staticFolder, 'bundle.js'),
    path: path.resolve(path.join(__dirname, staticFolder)),
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

      // LESS
      { test: /\.less$/, loader: 'style!css!less' },

      // images
      { test: /\.(jpeg|png)$/, loader: `file?name=${staticFolder}/[name].[ext]` },
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
