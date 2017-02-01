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

const staticFolderWithSlash = `${isProduction ? '/' : ''}${staticFolder}`;

export default {
  entry: {
    [`${staticFolder}/bundle.js`]: [
      './src/index',
    ].concat(
      isProduction
        ? []
        : [
          'webpack/hot/only-dev-server',
          'webpack-dev-server/client?http://localhost:3000',
        ]
      ),
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    filename: '/[name]',
    path: path.resolve('dist'),
    publicPath: '',
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
      { test: /\.(jpeg|png)$/, loader: `file?name=/${staticFolderWithSlash}/[name].[ext]` },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.tpl.html',
      filename: path.join(isProduction ? staticFolder : '', 'index.html'),
    }),
  ].concat(isProduction
    ? []
    : [new webpack.HotModuleReplacementPlugin()]
  ),
};
