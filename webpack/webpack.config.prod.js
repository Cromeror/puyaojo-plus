require("babel-polyfill");
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var commonLoadersClient = [
  {
    /*
     * TC39 categorises proposals for babel in 4 stages
     * Read more http://babeljs.io/docs/usage/experimental/
     */
    test: /\.js$|\.jsx$/,
    loader: 'babel-loader',
    // Reason why we put this here instead of babelrc
    // https://github.com/gaearon/react-transform-hmr/issues/5#issuecomment-142313637
    query: {
      presets: ['es2015', 'react', 'stage-0'],
      plugins: [
        'transform-react-remove-prop-types',
        'transform-react-constant-elements',
        'transform-react-inline-elements'
      ]
    },
    include: [
      path.join(__dirname, '..', 'app'),
      path.join(__dirname, '..', 'config'),
    ],
    exclude: path.join(__dirname, '..', 'node_modules')
  },
  {
    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
    loader: 'url',
    query: {
        name: '[hash].[ext]',
        limit: 10000,
    }
  },
  { test: /\.html$/, loader: 'html-loader' },
  { test: /\.json$/, exclude: /node_modules/, loader: 'json-loader' },
  { 
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style', 'css!sass')
  }
];

var commonConfig = require('./common.config');
var commonLoaders = commonConfig.commonLoaders;
var externals = commonConfig.externals;
var assetsPath = commonConfig.output.assetsPath;
var distPath = commonConfig.output.distPath;
var publicPath = commonConfig.output.publicPath;
var postCSSConfig = commonConfig.postCSSConfig;

module.exports = [
  {
    // The configuration for the client
    name: 'browser',
    // SourceMap without column-mappings
    devtool: 'cheap-module-source-map',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      app: ['babel-polyfill','./client']
    },
    output: {
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: '[name].js',
      // The output path from the view of the Javascript
      publicPath: publicPath

    },
    module: {
      loaders: commonLoadersClient
    },
    resolve: {
      root: [path.join(__dirname, '..', 'app')],
      extensions: ['', '.js', '.jsx', '.css'],
      alias: {
        react: path.resolve('node_modules/react'),
      },
    },
    plugins: [
        // extract inline css from modules into separate files
        new ExtractTextPlugin('styles/main.css', { allChunks: true }),
        new webpack.DefinePlugin({
          __DEVCLIENT__: true,
          __DEVSERVER__: false
        }),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false
          }
        }),
        new webpack.EnvironmentPlugin(['NODE_ENV'])
    ],
  }, {
    // The configuration for the server-side rendering
    name: 'server-side rendering',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      server: '../server/index'
    },
    target: 'node',
    node: {
      __dirname: false
    },
    devtool: 'sourcemap',
    output: {
      // The output directory as absolute path
      path: distPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: 'server.js',
      // The output path from the view of the Javascript
      publicPath: publicPath,
      libraryTarget: 'commonjs2'
    },
    module: {
      loaders: commonLoaders.concat([
        { 
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css!sass')
        }
      ])
    },
    resolve: {
      root: [path.join(__dirname, '..', 'app')],
      extensions: ['', '.js', '.jsx', '.css'],
      alias: {
        react: path.resolve('node_modules/react'),
      }
    },
    externals: externals,
    plugins: [
        // Order the modules and chunks by occurrence.
        // This saves space, because often referenced modules
        // and chunks get smaller ids.
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin('styles/main.css', { allChunks: true }),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new webpack.IgnorePlugin(/vertx/),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false
          }
        }),
        new webpack.DefinePlugin({
          __DEVCLIENT__: false,
          __DEVSERVER__: false
        }),
        new webpack.BannerPlugin(
          'require("source-map-support").install();',
          { raw: true, entryOnly: false }
        )
    ]
  }
];
