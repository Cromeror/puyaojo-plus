global.navigator = global.navigator || {}
global.navigator.userAgent = global.navigator.userAgent || 'all'

//import express from 'express';
import feathers from 'feathers'
import webpack from 'webpack'
import { isDebug } from '../config/app'
import { connect } from './db'
import initPassport from './init/passport'
import initExpress from './init/express'
import initRoutes from './init/routes'
import renderMiddleware from './render/middleware'

const app = feathers()

/*
 * Database-specific setup
 * - connect to MongoDB using mongoose
 * - register mongoose Schema
 */
connect.connect(function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  }
})

/*
 * REMOVE if you do not need passport configuration
 */
initPassport()

if (isDebug) {
  const webpackDevConfig = require('../webpack/webpack.config.dev-client')
  const compiler = webpack(webpackDevConfig)

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath,
    watchOptions: {
      poll: true
    }
  }))

  app.use(require('webpack-hot-middleware')(compiler))
}

/*
 * Bootstrap application settings
 */
initExpress(app)

/*
 * REMOVE if you do not need any routes
 *
 * Note: Some of these routes have passport and database model dependencies
 */
initRoutes(app)

/*
 * This is where the magic happens. We take the locals data we have already
 * fetched and seed our stores with data.
 * renderMiddleware matches the URL with react-router and renders the app into
 * HTML
 */
app.get('*', renderMiddleware)
app.listen(app.get('port'))